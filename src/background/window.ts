import { BrowserWindow, nativeTheme } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

import { currentOpenDocuments, removeDocumentOf, updateAppState } from './app-state'

function loadWith({ path, on: win }: { path: string, on: BrowserWindow }) {
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}#${path}`)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL(`app://./index.html#${path}`)
  }
}

export function createDocumentWindow(filePath: string): BrowserWindow {
  const window = new BrowserWindow({
    width: 1300,
    height: 800,
    minWidth: 520,
    webPreferences: {
      nodeIntegration: true,
      devTools: true, // isDevelopment,
      scrollBounce: true
    },
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#3e3b3e' : '#ffffff'
  })

  // @TODO: 곧 삭제
  window.setRepresentedFilename(filePath)

  loadWith({ path: 'document', on: window })

  window.on('closed', () => {
    removeDocumentOf({ window })
  })

  return window
}

// @TODO: Light <-> Dark 전환할 때마다 maximize 가능해짐..
export function createLaunchDialogWindow() {
  const launchDialog = new BrowserWindow({
    width: 650,
    height: 400,
    center: true,
    resizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: true // isDevelopment
    },
    vibrancy: 'sidebar',
    frame: false,
    titleBarStyle: 'hidden',
    show: false
  })

  loadWith({ path: 'launch-dialog', on: launchDialog })

  launchDialog.on('ready-to-show', () => {
    launchDialog?.show()
  })

  updateAppState({
    kind: "launch-dialog",
    documents: currentOpenDocuments(),
    launchDialog
  })

  launchDialog.on('closed', () => {
    if (currentOpenDocuments().length === 0) {
      updateAppState({ kind: "empty" })
    } else {
      updateAppState({
        kind: "documents",
        documents: currentOpenDocuments()
      })
    }
  })
}
