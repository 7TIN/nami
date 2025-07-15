import * as vscode from 'vscode';

// This is the main function that runs when your extension is activated.
export function activate(context: vscode.ExtensionContext) {

    console.log('Your "File Path Hint" extension is now active!');

    // Create a provider for our inlay hints.
    const provider: vscode.InlayHintsProvider = {
        
        // This is the core function that provides the hints.
        provideInlayHints(document, range) {

            // Get the relative path of the current file.
            // This makes the path shorter and more readable (e.g., src/app.ts instead of C:/Users/...)
            const relativePath = vscode.workspace.asRelativePath(document.uri);
            
            // Define the position for the hint: line 0, character 0 (the very top).
            const position = new vscode.Position(0, 0);

            // Create the inlay hint object.
            const hint = new vscode.InlayHint(
                position, // The position where the hint will be shown
                `// ${relativePath}`, // The text that will be displayed
                vscode.InlayHintKind.Parameter // The style of the hint
            );
            
            // Add a helpful tooltip when the user hovers over the hint.
            const markdownTooltip = new vscode.MarkdownString();
            markdownTooltip.appendMarkdown(`**File Path:** \`${relativePath}\``);
            markdownTooltip.appendMarkdown(`\n\nThis is a virtual hint provided by the extension and is not part of the actual file content.`);
            hint.tooltip = markdownTooltip;
            
            // Add some padding to the left to make it look nice and align with code.
            hint.paddingLeft = true;

            // Return an array containing our single hint.
            // VS Code will then render it in the editor.
            return [hint];
        }
    };

    // Now, we register our provider.
    // The selector { pattern: '**/*' } tells VS Code to run this for all files.
    const disposable = vscode.languages.registerInlayHintsProvider({ pattern: '**/*' }, provider);

    // Add the provider to the context's subscriptions.
    // This ensures it's cleaned up properly when the extension is deactivated.
    context.subscriptions.push(disposable);
}

// This function is called when your extension is deactivated.
export function deactivate() {}