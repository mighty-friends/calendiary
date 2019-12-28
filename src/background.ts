import { app, protocol, BrowserWindow, dialog, ipcMain } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import { init, getDuration, getDayTypes, getDiaries } from './model/model'

const isDevelopment = process.env.NODE_ENV !== 'production'

// @TODO: BrowerWindow[] 로 고치고 여러 파일 열 수 있게!

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let launchDialog: BrowserWindow | undefined
const documentWindows: BrowserWindow[] = []

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true
    }
  }
])

/// -------------------------- RENDER PROCESS IPC -------------------------- ///

const db = init();

ipcMain.handle('load', async _ => {
  const [duration, dayTypes, diaries] = await Promise.all([
    getDuration(await db),
    getDayTypes(await db),
    getDiaries(await db)
  ])

  return { duration, dayTypes, diaries }
})

ipcMain.handle('open-file', async _ => {
  const { canceled, filePaths: [filePath] } = await dialog.showOpenDialog({
    filters: [],
    properties: ['openFile', 'createDirectory']
  })

  if (!canceled) {
    documentWindows.push(createDocumentWindow(filePath))
    launchDialog?.close()
    launchDialog = undefined
  }
})


/// ------------------------------ WINDOWING ------------------------------- ///

function loadWith({ path, on: win }: { path: string, on: BrowserWindow }) {
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}${path}`)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL(`app://./index.html/${path}`)
  }
}

function createDocumentWindow(filePath: string): BrowserWindow {
  // Create the browser window.
  const win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      devTools: isDevelopment,
      scrollBounce: true
    }
  })

  win.setRepresentedFilename(filePath)

  loadWith({ path: 'document', on: win })

  win.on('closed', () => {
    const index = documentWindows.indexOf(win)
    documentWindows.splice(index, 1)
  })

  return win
}

function createLaunchDialogWindow() {
  // Create the browser window.
  launchDialog = new BrowserWindow({
    width: 650,
    height: 400,
    center: true,
    resizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: isDevelopment
    },
    vibrancy: 'sidebar',
    frame: false,
    titleBarStyle: 'hidden'
  })

  loadWith({ path: 'launch-dialog', on: launchDialog })

  launchDialog.on('closed', () => {
    launchDialog = undefined
  })
}


/// ------------------------- GLOBAL APP LIFECYCLE ------------------------- ///

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (documentWindows.length === 0 && launchDialog === undefined) {
    createLaunchDialogWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }

  }
  createLaunchDialogWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
