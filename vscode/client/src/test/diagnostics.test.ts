/********************************************************************************
 * Licensed Materials - Property of IBM "Restricted Materials of IBM"
 *
 * Copyright IBM Corp. 2019 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 ******************************************************************************/
'use strict';

import * as assert from 'assert';
import {
  Diagnostic,
  DiagnosticSeverity,
  languages,
  Position,
  Range,
  Uri,
} from 'vscode';
import { activate, getDocUri } from './helper';

describe('Should get diagnostics', () => {
  const docUri: Uri = getDocUri('test.js');

  it('Generates the message and displays at the right line', async () => {
    await testDiagnostics(docUri, [
      {
        message: 'Function example accumulated 55 ticks',
        range: toRange(6, 0, 6, 9999),
        severity: DiagnosticSeverity.Warning,
        source: 'Microclimate Language Server',
      },
      {
        message: 'Function <anonymous function> accumulated 115 ticks',
        range: toRange(0, 0, 0, 9999),
        severity: DiagnosticSeverity.Warning,
        source: 'Microclimate Language Server' },
    ]);
  });
});

function toRange(sLine: number, sChar: number, eLine: number, eChar: number): Range {
  const start: Position = new Position(sLine, sChar);
  const end: Position = new Position(eLine, eChar);
  return new Range(start, end);
}

async function getDiagnostics(docUri: Uri): Promise<Diagnostic[]> {
  await activate(docUri);
  return languages.getDiagnostics(docUri);
}

async function testDiagnostics(docUri: Uri, expectedDiagnostics: Diagnostic[]): Promise<void> {

  const actualDiagnostics: Diagnostic[] = await getDiagnostics(docUri);
  assert.equal(actualDiagnostics.length, expectedDiagnostics.length);

  expectedDiagnostics.forEach((expectedDiagnostic: Diagnostic, i: number) => {
    const actualDiagnostic: Diagnostic = actualDiagnostics[i];
    console.dir(actualDiagnostic);

    assert.equal(actualDiagnostic.message, expectedDiagnostic.message);
    assert.deepEqual(actualDiagnostic.range, expectedDiagnostic.range);
    assert.equal(actualDiagnostic.severity, expectedDiagnostic.severity);
  });
}
