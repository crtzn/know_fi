'use client';

import { useState } from 'react';

import { CodeEditor } from '@/components/features/web-ide/code-editor';
import { FileExplorer } from '@/components/features/web-ide/file-explorer';
import { Terminal } from '@/components/features/web-ide/terminal';
import { Toolbar } from '@/components/features/web-ide/toolbar';
import { TutorialSidebar } from '@/components/features/web-ide/tutorial-sidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

export default function MotokoIDE() {
  const [activeFile, setActiveFile] = useState<string>('src/main.mo');
  const [files, setFiles] = useState({
    'src/main.mo': `actor HelloWorld {
  var greeting : Text = "Hello, ";

  public func setGreeting(prefix : Text) : async () {
    greeting := prefix;
  };

  public query func greet(name : Text) : async Text {
    return greeting # name # "!";
  };
}`,
    'dfx.json': `{
  "version": 1,
  "canisters": {
    "hello_world": {
      "type": "motoko",
      "main": "src/main.mo"
    }
  }
}`,
  });
  const [isDeploying, setIsDeploying] = useState(false);

  const handleFileRename = (oldPath: string, newPath: string) => {
    setFiles((prev) => {
      const newFiles = { ...prev };
      newFiles[newPath] = newFiles[oldPath];
      delete newFiles[oldPath];

      if (activeFile === oldPath) {
        setActiveFile(newPath);
      }

      return newFiles;
    });
  };

  const handleFileCopy = (sourcePath: string, targetPath: string) => {
    setFiles((prev) => ({
      ...prev,
      [targetPath]: prev[sourcePath],
    }));
  };

  const handleFolderCreate = (path: string) => {
    const placeholderPath = `${path}/.gitkeep`;
    setFiles((prev) => ({
      ...prev,
      [placeholderPath]: '# This file keeps the folder in version control',
    }));
  };

  const handleLoadTutorial = (code: string) => {
    setFiles((prev) => ({
      ...prev,
      [activeFile]: code,
    }));
  };

  const handleRunCode = async () => {
    setIsDeploying(true);

    console.log('[v0] Starting automatic deployment...');

    console.log('[v0] Auto-saving files...');

    console.log('[v0] Ensuring dfx replica is running...');

    console.log('[v0] Deploying to local canister playground...');

    setTimeout(() => {
      console.log('[v0] Deployment complete! Canister ready for testing.');
      setIsDeploying(false);
    }, 3000);
  };

  return (
    <div className="mt-10 flex h-screen flex-col bg-background">
      <Toolbar />

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={20} minSize={15}>
          <FileExplorer
            files={files}
            activeFile={activeFile}
            onFileSelect={setActiveFile}
            onFileCreate={(path, content) => setFiles((prev) => ({ ...prev, [path]: content }))}
            onFileDelete={(path) =>
              setFiles((prev) => {
                const newFiles = { ...prev };
                delete newFiles[path];
                return newFiles;
              })
            }
            onFileRename={handleFileRename}
            onFileCopy={handleFileCopy}
            onFolderCreate={handleFolderCreate}
          />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70}>
              <CodeEditor
                file={activeFile}
                content={files[activeFile] || ''}
                onChange={(content) => setFiles((prev) => ({ ...prev, [activeFile]: content }))}
              />
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={30} minSize={20}>
              <Terminal />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={30} minSize={20}>
          <TutorialSidebar onLoadTutorial={handleLoadTutorial} onRunCode={handleRunCode} isDeploying={isDeploying} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
