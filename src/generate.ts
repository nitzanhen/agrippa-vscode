import { dirname, join } from 'path';
import { run } from 'agrippa';
import * as vscode from 'vscode';
import { lstat } from 'node:fs/promises';
import { existsSync } from 'fs';
import { glob } from 'glob';

export async function generateComponent(ctx: any): Promise<void> {
  if (!ctx) {
    vscode.window.showErrorMessage('A component can only be generated through the context menu of a file or directory');
    return;
  }

  const path = ctx.fsPath as string;
  // Check if the path is a file or directory
  const isDir = (await lstat(path)).isDirectory();

  const dir = isDir ? path : dirname(path);

  const baseDir = vscode.workspace.workspaceFolders?.[0].uri.fsPath as string;
  const [configPath] = await glob('**/agrippa.config.mjs', { cwd: baseDir });
  if (!configPath) {
    vscode.window.showErrorMessage('An Agrippa config file is required in the root of the project');
    return;
  }

  const name = await vscode.window.showInputBox({
    placeHolder: 'Component name',
    prompt: 'Enter the name of the component',
  });

  if (!name) {
    return;
  }


  console.log(configPath);


  try {
    const result = await run({
      name,
      destination: dir,
      allowOutsideBase: true,
      // baseDir,
      debug: true
    }, {
      envFiles: {
        agrippaConfig: configPath,
      },
      basePath: baseDir,
    });

    console.log(result);

    await vscode.window.showTextDocument(
      vscode.Uri.file(result.createdFiles[0].path),
    );

    const createdName = result.options.name;

    // Todo check for success
    vscode.window.showInformationMessage(`Component ${createdName} created successfully!`);
  }
  catch (e) {
    console.error(e);
    vscode.window.showErrorMessage(`Error creating component ${name}`);
  }
}
