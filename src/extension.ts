import * as vscode from "vscode";

const COPY_PATH_COMMAND_ID = 'nami.copyFilePath';

function formatPathForDisplay(relativePath: string): string {
  const MAX_LENGTH = 80;

  const normalized = relativePath.replace(/\\/g, "/");
  const segments = normalized.split("/");
  const originalSegments = [...segments];
  if (segments.length === 0) return relativePath;

  while (segments.length > 0) {
    const candidate = segments.join("/");

    // If it fits and the filename is fully visible, return it
    if (candidate.length <= MAX_LENGTH) {
      const filename = segments[segments.length - 1];
      // Check if filename appears completely at the end
      if (candidate.endsWith(filename)) {
        const wasTrimmed = segments.length < originalSegments.length;
        return wasTrimmed ? `.../${candidate}` : candidate;
      }
    }

    // Remove one folder from the front and try again
    segments.shift();
  }

  // Fallback: return filename only
  const filename = originalSegments[originalSegments.length - 1];
  return `.../${filename}`;
}



export function activate(context: vscode.ExtensionContext) {
  console.log('File Path Hint extension is active.');

  context.subscriptions.push(
    vscode.commands.registerCommand(COPY_PATH_COMMAND_ID, (path: string) => {
      vscode.env.clipboard.writeText(path);
      vscode.window.showInformationMessage('Full file path copied!');
    })
  );

  const provider: vscode.InlayHintsProvider = {
    provideInlayHints(document) {
      const absolutePath = document.uri.fsPath;
      const relativePath = vscode.workspace.asRelativePath(absolutePath);
      const displayPath = `// ${formatPathForDisplay(relativePath)}\n`;
      const position = new vscode.Position(0, 0);

      const command: vscode.Command = {
        title: "Copy Full Path",
        command: COPY_PATH_COMMAND_ID,
        arguments: [absolutePath], 
      };

      const labelPart = new vscode.InlayHintLabelPart(displayPath);
      labelPart.command = command; 

      const hint = new vscode.InlayHint(position, [labelPart]);
      hint.paddingLeft = true;
      
      const tooltip = new vscode.MarkdownString();
      tooltip.isTrusted = true;
      tooltip.appendMarkdown(`**Full Path:** \`${absolutePath}\``);
      tooltip.appendMarkdown(`\n\n[Click to copy](command:${COPY_PATH_COMMAND_ID}?${encodeURIComponent(JSON.stringify([absolutePath]))})`);
      hint.tooltip = tooltip;

      return [hint];
    },
  };

  context.subscriptions.push(
    vscode.languages.registerInlayHintsProvider({ scheme: "file" }, provider)
  );
}

export function deactivate() {}