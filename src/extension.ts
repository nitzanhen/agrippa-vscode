import { dirname } from 'path';
import { run } from 'agrippa';
import * as vscode from 'vscode';
import { lstat } from 'node:fs/promises';
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('agrippa.helloWorld', async (ctx) => {
		const path = ctx.fsPath as string;
		// Check if the path is a file or directory
		const isDir = (await lstat(path)).isDirectory();

		const dir = isDir ? path : dirname(path);

		const baseDir = vscode.workspace.workspaceFolders?.[0].uri.fsPath as string;
		console.log(dir, baseDir);

		const name = await vscode.window.showInputBox({
			placeHolder: 'Component name',
			prompt: 'Enter the name of the component',

		});

		if (!name) {
			return;
		}

		const result = await run({
			name,
			destination: dir,
			baseDir,
			debug: true
		});

		console.log(result);

		// Todo check for success
		vscode.window.showInformationMessage(`Component ${name} created successfully!`);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
