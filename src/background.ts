import { app, protocol, dialog, ipcMain } from 'electron'
import { installVueDevtools } from 'vue-cli-plugin-electron-builder/lib'

import { findDocumentOf, openNewDocumentWith, state } from './background/app-state'
import { createLaunchDialogWindow } from './background/window'
import { getDuration, getDayTypes, getDiaries } from './background/model'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

/// -------------------------- RENDER PROCESS IPC -------------------------- ///

// ipcMain.handle('new-file', async _ => {
//   const { canceled, filePath } = await dialog.showSaveDialog({
//     filters: [{ name: 'calendiary', extensions: [ 'calendiary' ] }]
//   })

//   if (!canceled && filePath) {
//     const database = init(filePath)
//     const window = createDocumentWindow(filePath)

//     documents.push({ window, database })

//     launchDialog?.close()
//     launchDialog = undefined
//   }
// })

ipcMain.handle('load', async ({ sender }) => {
  const { database } = findDocumentOf({ sender })!

  const [duration, dayTypes, diaries] = await Promise.all([
    getDuration(await database),
    getDayTypes(await database),
    getDiaries(await database)
  ])

  return { duration, dayTypes, diaries }
})

ipcMain.handle('open-file', async _ => {
  const { canceled, filePaths: [path] } = await dialog.showOpenDialog({
    filters: [{ name: 'calendiary', extensions: [ 'calendiary' ] }],
    properties: ['openFile', 'createDirectory']
  })

  if (!canceled) {
    openNewDocumentWith({ path })
  }
})

/// ------------------------- GLOBAL APP LIFECYCLE ------------------------- ///

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // macOS에서는 모든 창이 닫혀도 유저가 cmd+Q로 종료하기 전까지는 프로그램을 종료하지 않는다
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // macOS에서 창이 없는 상태에서 독 아이콘이 클릭된 경우
  if (state() === "empty") {
    createLaunchDialogWindow()
  }
})

// 창 만들 준비 완료. 몇몇 API는 초기화되지 않음.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
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
