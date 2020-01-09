import { BrowserWindow, nativeTheme, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

import { onLaunchDialogClose, onDocumentClose, onNewDocumentClose } from './app-state'

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
      devTools: true // isDevelopment,
    },
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#3e3b3e' : '#ffffff'
  })

  loadWith({ path: 'document', on: window })

  window.on('closed', () => { onDocumentClose({ window }) })

  return window
}

const dialogsDefaultOptions = {
  center: true,
  resizable: false,
  maximizable: false,
  webPreferences: {
    nodeIntegration: true,
    devTools: true // isDevelopment
  },
  frame: false
}

// @TODO: Light <-> Dark 전환할 때마다 maximize 가능해짐..
export function createLaunchDialogWindow(): BrowserWindow {
  const launchDialog = new BrowserWindow({
    width: 650,
    height: 400,
    vibrancy: 'sidebar',
    titleBarStyle: 'hidden',
    show: false,
    ...dialogsDefaultOptions
  })

  loadWith({ path: 'launch-dialog', on: launchDialog })

  launchDialog.on('ready-to-show', () => { launchDialog.show() })
  launchDialog.on('closed', () => { onLaunchDialogClose() })

  return launchDialog
}

export function createNewDocumentWindow(): BrowserWindow {
  const newDocument = new BrowserWindow({
    width: 360,
    height: 500,
    titleBarStyle: 'hiddenInset',
    show: false,
    ...dialogsDefaultOptions
  })

  loadWith({ path: 'new-document', on: newDocument })

  newDocument.on('ready-to-show', () => { newDocument.show() })
  newDocument.on('closed', () => { onNewDocumentClose() })

  return newDocument
}

export async function createSaveDialog (): Promise<{ canceled: false, path: string} | { canceled: true }> {
  const { canceled, filePath: path } = await dialog.showSaveDialog({
    filters: [{ name: 'calendiary', extensions: [ 'calendiary' ] }]
  })

  if (!canceled) return { canceled, path: path! }
  else return { canceled }
}

export async function createOpenDialog (): Promise<{ canceled: false, path: string } | { canceled: true }> {
  const { canceled, filePaths: [path] } = await dialog.showOpenDialog({
    filters: [{ name: 'calendiary', extensions: [ 'calendiary' ] }],
    properties: ['openFile', 'createDirectory']
  })

  if (!canceled) return { canceled, path }
  else return { canceled }
}
