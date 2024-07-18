// src/extension.ts
import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.workspace.onWillSaveTextDocument(event => {
		const document = event.document;
		const fileName = document.fileName;

		// .tsxまたは.tsファイルのみを処理
		if (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) {
			const edit = new vscode.WorkspaceEdit();
			const firstLine = document.lineAt(0);
			const relativePath = path.relative(vscode.workspace.rootPath || '', fileName);
			const pathComment = `// ${relativePath}`;

			if (firstLine.text.startsWith('//')) {
				// 既存のコメントを更新
				edit.replace(document.uri, firstLine.range, pathComment);
			} else {
				// 新しいコメントを追加
				edit.insert(document.uri, new vscode.Position(0, 0), pathComment + '\n\n');
			}

			event.waitUntil(vscode.workspace.applyEdit(edit));
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
