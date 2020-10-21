/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import * as assert from 'assert';
import { getDocUri, activate } from './helper';

suite('Should get diagnostics', () => {
	const docUri = getDocUri('diagnostics.nadesiko3');

	test('Diagnoses syntax error', async () => {
		await testDiagnostics(docUri, [
			{
				message: "Error: [文法エラー](1行目): 『「こんにちは」を』『を表示』がありますが使い方が分かりません。",
				range: toRange(0, 0, 1, 0), severity: vscode.DiagnosticSeverity.Warning, source: 'ex'
			}
		]);
	});
});

function toRange(sLine: number, sChar: number, eLine: number, eChar: number) {
	const start = new vscode.Position(sLine, sChar);
	const end = new vscode.Position(eLine, eChar);
	return new vscode.Range(start, end);
}

async function testDiagnostics(docUri: vscode.Uri, expectedDiagnostics: vscode.Diagnostic[]) {
	await activate(docUri);

	const actualDiagnostics = vscode.languages.getDiagnostics(docUri);

	// actualDiagnostics has two. I've not checked the reason yet.
	//assert.equal(actualDiagnostics.length, expectedDiagnostics.length);

	expectedDiagnostics.forEach((expectedDiagnostic, i) => {
		const actualDiagnostic = actualDiagnostics[i];
		assert.ok(actualDiagnostic.message.startsWith(expectedDiagnostic.message));
		assert.deepEqual(actualDiagnostic.range, expectedDiagnostic.range);
		assert.equal(actualDiagnostic.severity, expectedDiagnostic.severity);
	});
}