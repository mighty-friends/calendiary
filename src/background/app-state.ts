import assert from 'assert'
import {
  BrowserWindow,
  WebContents
} from 'electron'
import { Database } from 'sqlite'

import { open } from './model'
import { createDocumentWindow } from './window'

/// 열린 창과 관련된 모든 런타임 데이터.
/// gc되면 창이 닫히는 불상사가 일어나기 때문에 전역으로 참조되고 있어야 함.
interface Document {
  window: BrowserWindow,
  database: Promise<Database>
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

export function updateAppState(newAppState: AppState) {
  appState = newAppState
}

export function openNewDocumentWith({ path }: { path: string }) {
  const window = createDocumentWindow(path)
  const database = open(path)

  switch (appState.kind) {
    case "empty":
      appState = {
        kind: "documents",
        documents: [{ window, database }]
      }
      break
    case "launch-dialog":
      appState.launchDialog.close()
      appState.documents.push({ window, database })
      appState = {
        kind: "documents",
        documents: appState.documents
      }
      break
    case "new-document":
      appState.newDocument.close()
      appState.documents.push({ window, database })
      appState = {
        kind: "documents",
        documents: appState.documents
      }
      break
    case "documents":
      appState.documents.push({ window, database })
      break
  }
}

export function state(): "empty" | "launch-dialog" | "new-document" | "documents" {
  return appState.kind
}

export function currentOpenDocuments(): Document[] {
  switch (appState.kind) {
    case "empty":
      return []
    case "launch-dialog":
    case "new-document":
    case "documents":
      return appState.documents
  }
}

// @TODO: 좀 추하다.. 걍 WebContents 대신 Window를 받자...,,
export function findDocumentOf({ sender }: { sender: WebContents }): Document | undefined {
  const win = BrowserWindow.fromWebContents(sender)
  const documents = currentOpenDocuments()
  return documents.find(document => document.window === win)
}

async function removeDocumentAt({ index }: { index: number }) {
  const documents = currentOpenDocuments()

  assert.ok(0 <= index, 'Remove document with index out of lower bound.')
  assert.ok(documents.length > index, 'Remove document with index out of upper bound.')

  const [removedDocument] = documents.splice(index, 1)
  const database = await removedDocument.database
  database.close()

  if (documents.length === 0 && appState.kind === "documents") {
    appState = { kind: "empty" }
  }
}

export async function removeDocumentOf({ window }: { window: BrowserWindow }) {
  const index = currentOpenDocuments()
    .map(({ window }) => window)
    .indexOf(window)
  
  assert.ok(0 <= index, 'Remove document with wrong window.')

  await removeDocumentAt({ index })
}
