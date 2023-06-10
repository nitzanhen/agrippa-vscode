import * as vscode from 'vscode';
import { generateComponent } from './generate';
import { initConfig } from './initConfig';


const commands = {
	generate: 'agrippa.generate',
	initConfig: 'agrippa.init',
};

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand(commands.generate, generateComponent),
		vscode.commands.registerCommand(commands.initConfig, initConfig),
	);

}

export function deactivate() { }
