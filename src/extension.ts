
import * as vscode from "vscode";

const COPY_PATH_COMMAND_ID = 'nami.copyFilePath';

function formatPathForDisplay(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/");
  const importantRoots = ["src", "app", "pages", "main", "lib", "components"];

  const segments = normalized.split("/");
  const filename = segments[segments.length - 1];

  let startIndex = 0;
  for (const root of importantRoots) {
    const idx = segments.indexOf(root);
    if (idx !== -1) {
      startIndex = idx;
      break;
    }
  }

  let visibleSegments = segments.slice(startIndex);

  let rebuilt = visibleSegments.join("/");

  while (!rebuilt.endsWith(filename) && visibleSegments.length > 1) {
    visibleSegments.shift();
    rebuilt = visibleSegments.join("/");
  }

  const wasTrimmed = startIndex > 0 || visibleSegments.length < segments.length;
  return wasTrimmed ? `.../${rebuilt}` : rebuilt;
}

export function activate(context: vscode.ExtensionContext) {
  console.log('File Path Hint extension is active.');

  context.subscriptions.push(
    vscode.commands.registerCommand(COPY_PATH_COMMAND_ID, (path: string) => {
      vscode.env.clipboard.writeText(path);
      vscode.window.showInformationMessage('Path copied!');
    })
  );

  const provider: vscode.InlayHintsProvider = {
    provideInlayHints(document) {
      const absolutePath = document.uri.fsPath;
      const relativePath = vscode.workspace.asRelativePath(absolutePath);
      const displayPath = `// ${formatPathForDisplay(relativePath)}

`;
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

      // Removed tooltip to avoid showing dialog box on hover

      return [hint];
    },
  };

  context.subscriptions.push(
    vscode.languages.registerInlayHintsProvider({ scheme: "file" }, provider)
  );
}

export function deactivate() {}
