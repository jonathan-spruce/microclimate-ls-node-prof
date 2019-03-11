/********************************************************************************
 * Licensed Materials - Property of IBM "Restricted Materials of IBM"
 *
 * Copyright IBM Corp. 2019 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 ******************************************************************************/
'use strict';

import * as path from 'path';
import {
  Extension,
  extensions,
  Range,
  TextDocument,
  TextEditor,
  TextEditorEdit,
  Uri,
  window,
  workspace,
 } from 'vscode';

export let doc: TextDocument;
export let editor: TextEditor;
export let documentEol: string;
export let platformEol: string;

const workspacePath: string = path.resolve(__dirname, 'microclimate-workspace');
/**
 * Activates the vscode.lsp-sample extension
 */
export async function activate(docUri: Uri): Promise<void> {
  // The extensionId is `publisher.name` from package.json
  console.log('TEST');
  console.log(extensions.all.map((e: Extension<any>) => e.id));

  const ext: Extension<any> = extensions.getExtension('IBM.microclimate-ls-node-prof-vscode-client');
  await ext.activate();
  try {
    await workspace.updateWorkspaceFolders(0, null, { uri: Uri.file(workspacePath) });
    doc = await workspace.openTextDocument(docUri);
    editor = await window.showTextDocument(doc);
    await sleep(2000); // Wait for server activation
  } catch (e) {
    console.error(e);
  }
}

export async function sleep(ms: number): Promise<void> {
  // tslint:disable-next-line:typedef
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getDocPath(p: string): string {
  return path.resolve(workspacePath, 'project', p);
}
export function getDocUri(p: string): Uri {
  return Uri.file(getDocPath(p));
}

export async function setTestContent(content: string): Promise<boolean> {
  const all: Range = new Range(
    doc.positionAt(0),
    doc.positionAt(doc.getText().length),
  );
  return editor.edit((eb: TextEditorEdit) => eb.replace(all, content));
}
