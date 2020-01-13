import assert from 'assert'

import { BrowserWindow, ipcMain, protocol, app } from 'electron'
import { installVueDevtools, createProtocol } from 'vue-cli-plugin-electron-builder/lib'

import { CalendiaryConnection as Connection } from '@/background'
import { createLaunchDialogWindow, createDocumentWindow, createOpenDialog, createNewDocumentWindow, createSaveDialog } from './window'
import { model } from './model'

/// 열린 창과 관련된 모든 런타임 데이터.
/// gc되면 창이 닫히는 불상사가 일어나기 때문에 전역으로 참조되고 있어야 함.
interface Document {
  window: BrowserWindow,
  database: Promise<Connection>
}

interface LaunchDialog {
  kind: "launch-dialog",
  documents: Document[]
  launchDialog: BrowserWindow,
}

interface NewDocument {
  kind: "new-document",
  documents: Document[]
  newDocument: BrowserWindow,
}

interface Documents {
  kind: "documents",
  documents: Document[]
}

interface Empty {
  kind: "empty"
}

type AppState = LaunchDialog | NewDocument | Documents | Empty

let appState: AppState = { kind: "empty" }

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

/// Non-mutating
function currentOpenDocuments(): Document[] {
  switch (appState.kind) {
    case "empty":
      return []
    case "launch-dialog":
    case "new-document":
    case "documents":
      return appState.documents
  }
}

/// Non-mutating
/// 이 window에 해당하는 document 찾기
function findDocumentOf({ window }: { window: BrowserWindow }): Document | undefined {
  const documents = currentOpenDocuments()
  return documents.find(document => document.window === window)
}

/// Mutating
async function removeDocumentOf({ window }: { window: BrowserWindow }) {
  const documents = currentOpenDocuments()

  const index = documents
    .map(({ window }) => window)
    .indexOf(window)

  assert.ok(0 <= index, 'Given window is not in documents.')

  const database = await documents.splice(index, 1)[0].database
  database.closeCalendiary()

  if (documents.length === 0 && appState.kind === "documents") {
    appState = { kind: "empty" }
  }
}

function openDocumentWith({ path }: { path: string }) {
  const document = {
    window: createDocumentWindow(),
    database: model.loadCalendiary(path)
  }

  switch (appState.kind) {
    case "empty":
      appState = { kind: "documents", documents: [document] }
      break
    case "launch-dialog":
      appState.launchDialog.close()
      appState = { kind: "documents", documents: [...appState.documents, document] }
      break
    case "new-document":
      appState.newDocument.close()
      appState = { kind: "documents", documents: [...appState.documents, document] }
      break
    case "documents":
      appState.documents = [...appState.documents, document]
      break
  }
}

export async function onDocumentClose({ window }: { window: BrowserWindow }) {
  removeDocumentOf({ window })
}

export async function onLaunchDialogClose() {
  // 사용자가 창을 닫은거라면 appState를 변경하고,
  // 코드에 의해 닫힌거라면 창을 닫은 코드가 appState를 변경시키도록 내버려둔다.
  if (appState.kind === "launch-dialog") {
    if (currentOpenDocuments().length === 0) {
      appState = { kind: "empty" }
    } else {
      appState = {
        kind: "documents",
        documents: currentOpenDocuments()
      }
    }
  }
}

export async function onNewDocumentClose() {
  if (appState.kind === "new-document") {
    if (currentOpenDocuments().length === 0) {
      appState = { kind: "empty" }
    } else {
      appState = {
        kind: "documents",
        documents: currentOpenDocuments()
      }
    } 
  }
}

/// -------------------------- RENDER PROCESS IPC -------------------------- ///

ipcMain.handle('new-document', _ => {
  switch (appState.kind) {
    case "launch-dialog":
      appState.launchDialog.close()
    case "empty":
    case "documents":
      break
    case "new-document":
      console.error('Try to open new document while it\'s already in the state of new document')
      return
  }

  appState = {
    kind: 'new-document',
    newDocument: createNewDocumentWindow(),
    documents: currentOpenDocuments()
  }
})

ipcMain.handle('save-document', async (_, config) => {
  const result = await (() => {
    switch (appState.kind) {
      case "new-document":
        return createSaveDialog(appState.newDocument)
      default:
        console.error('Initializing document on state: ', appState.kind)
        // @TODO: 이게 허용돼야하냐..?
        return createSaveDialog(undefined)
  }})()

  if (result.canceled) {
    return { canceled: true }
  } else {
    const window = createDocumentWindow()
    const database = model.initCalendiary(result.path, config)

    switch(appState.kind) {
      case "new-document":
        appState.newDocument.close()
        break
      default:
        console.error('Initializing document on state: ', appState.kind)
        break
    }

    appState = {
      kind: "documents",
      documents: [...currentOpenDocuments(), { window, database }]
    }
  }
})

ipcMain.handle('load-document', async ({ sender }) => {
  const window = BrowserWindow.fromWebContents(sender)
  const database = await findDocumentOf({ window })!.database

  return database.getCalendiary()
})

ipcMain.handle('open-document', async _ => {
  const result = await createOpenDialog()

  if (!result.canceled) {
    openDocumentWith({ path: result.path })
  }
})

const isDevelopment = process.env.NODE_ENV !== 'production'

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // macOS에서는 모든 창이 닫혀도 유저가 cmd+Q로 종료하기 전까지는 프로그램을 종료하지 않는다
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // macOS에서 창이 없는 상태에서 독 아이콘이 클릭된 경우
  if (appState.kind === "empty") {
    const launchDialog = createLaunchDialogWindow()
    appState = {
      kind: "launch-dialog",
      documents: [],
      launchDialog
    }
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

  const launchDialog = createLaunchDialogWindow()

  appState = {
    kind: "launch-dialog",
    documents: [],
    launchDialog
  }
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
