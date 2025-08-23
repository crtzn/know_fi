"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Folder, FolderOpen, Plus, FileCode, Settings, FolderPlus, Copy, Scissors } from "lucide-react"

interface FileExplorerProps {
  files: Record<string, string>
  activeFile: string
  onFileSelect: (file: string) => void
  onFileCreate: (path: string, content: string) => void
  onFileDelete: (path: string) => void
  onFileRename?: (oldPath: string, newPath: string) => void
  onFileCopy?: (sourcePath: string, targetPath: string) => void
  onFolderCreate?: (path: string) => void
}

export function FileExplorer({
  files,
  activeFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onFileCopy,
  onFolderCreate,
}: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["src"]))
  const [newFileName, setNewFileName] = useState("")
  const [showNewFile, setShowNewFile] = useState(false)
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [renameTarget, setRenameTarget] = useState("")
  const [renameValue, setRenameValue] = useState("")
  const [clipboard, setClipboard] = useState<{ path: string; operation: "copy" | "cut" } | null>(null)
  const [fileTemplate, setFileTemplate] = useState("actor")

  const getFileIcon = (filename: string) => {
    if (filename.endsWith(".mo")) return <FileCode className="w-4 h-4 text-blue-400" />
    if (filename.endsWith(".json")) return <Settings className="w-4 h-4 text-yellow-400" />
    if (filename.endsWith(".md")) return <FileText className="w-4 h-4 text-green-400" />
    return <FileText className="w-4 h-4 text-gray-400" />
  }

  const getFileTemplate = (fileName: string, template: string) => {
    const baseName = fileName.replace(/\.(mo|json|md)$/, "").replace(/[^a-zA-Z0-9]/g, "")

    switch (template) {
      case "actor":
        return `import Debug "mo:base/Debug";

actor ${baseName} {
  public func greet(name : Text) : async Text {
    Debug.print("Hello from ${baseName}!");
    return "Hello, " # name # "!";
  };
}`
      case "module":
        return `import Debug "mo:base/Debug";

module ${baseName} {
  public func helper() : Text {
    return "Helper function from ${baseName}";
  };
}`
      case "class":
        return `import Debug "mo:base/Debug";

class ${baseName}() {
  public func method() : Text {
    return "Method from ${baseName} class";
  };
}`
      case "library":
        return `// ${baseName} Library
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Text "mo:base/Text";

module {
  // Public API functions
  public func process(input: Text) : Text {
    return "Processed: " # input;
  };
}`
      default:
        return `// ${fileName}\n// Add your code here`
    }
  }

  const organizeFiles = () => {
    const organized: Record<string, any> = {}

    Object.keys(files).forEach((filePath) => {
      const parts = filePath.split("/")
      let current = organized

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          current[part] = { type: "file", path: filePath }
        } else {
          if (!current[part]) {
            current[part] = { type: "folder", children: {} }
          }
          current = current[part].children
        }
      })
    })

    return organized
  }

  const handleRename = () => {
    if (renameTarget && renameValue.trim() && onFileRename) {
      const pathParts = renameTarget.split("/")
      pathParts[pathParts.length - 1] = renameValue.trim()
      const newPath = pathParts.join("/")
      onFileRename(renameTarget, newPath)
      setShowRenameDialog(false)
      setRenameTarget("")
      setRenameValue("")
    }
  }

  const handleCopy = (filePath: string) => {
    setClipboard({ path: filePath, operation: "copy" })
  }

  const handleCut = (filePath: string) => {
    setClipboard({ path: filePath, operation: "cut" })
  }

  const handlePaste = (targetFolder: string) => {
    if (clipboard && onFileCopy) {
      const fileName = clipboard.path.split("/").pop() || ""
      const newPath = targetFolder ? `${targetFolder}/${fileName}` : fileName
      onFileCopy(clipboard.path, newPath)

      if (clipboard.operation === "cut") {
        onFileDelete(clipboard.path)
      }
      setClipboard(null)
    }
  }

  const renderFileTree = (items: any, path = "") => {
    return Object.entries(items).map(([name, item]: [string, any]) => {
      const fullPath = path ? `${path}/${name}` : name

      if (item.type === "file") {
        return (
          <ContextMenu key={item.path}>
            <ContextMenuTrigger>
              <div
                className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-accent rounded text-sm ${
                  activeFile === item.path ? "bg-accent" : ""
                } ${clipboard?.path === item.path ? "opacity-50" : ""}`}
                onClick={() => onFileSelect(item.path)}
              >
                {getFileIcon(name)}
                <span>{name}</span>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={() => {
                  setRenameTarget(item.path)
                  setRenameValue(name)
                  setShowRenameDialog(true)
                }}
              >
                Rename
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleCopy(item.path)}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handleCut(item.path)}>
                <Scissors className="w-4 h-4 mr-2" />
                Cut
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onFileDelete(item.path)} className="text-destructive">
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )
      } else {
        const isExpanded = expandedFolders.has(fullPath)
        return (
          <div key={fullPath}>
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-accent rounded text-sm"
                  onClick={() => {
                    const newExpanded = new Set(expandedFolders)
                    if (isExpanded) {
                      newExpanded.delete(fullPath)
                    } else {
                      newExpanded.add(fullPath)
                    }
                    setExpandedFolders(newExpanded)
                  }}
                >
                  {isExpanded ? (
                    <FolderOpen className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Folder className="w-4 h-4 text-blue-400" />
                  )}
                  <span>{name}</span>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() => {
                    setNewFolderName("")
                    setShowNewFolder(true)
                  }}
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  New Folder
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => {
                    setNewFileName("")
                    setShowNewFile(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New File
                </ContextMenuItem>
                {clipboard && <ContextMenuItem onClick={() => handlePaste(fullPath)}>Paste</ContextMenuItem>}
              </ContextMenuContent>
            </ContextMenu>
            {isExpanded && <div className="ml-4">{renderFileTree(item.children, fullPath)}</div>}
          </div>
        )
      }
    })
  }

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      const extension =
        newFileName.endsWith(".mo") || newFileName.endsWith(".json") || newFileName.endsWith(".md") ? "" : ".mo"
      const fullPath = `src/${newFileName}${extension}`
      const template = getFileTemplate(newFileName + extension, fileTemplate)

      onFileCreate(fullPath, template)
      setNewFileName("")
      setShowNewFile(false)
      setFileTemplate("actor")
    }
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim() && onFolderCreate) {
      onFolderCreate(`src/${newFolderName}`)
      setNewFolderName("")
      setShowNewFolder(false)
    }
  }

  return (
    <div className="h-full bg-card border-r flex flex-col">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Explorer</h3>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => setShowNewFile(true)}>
              <Plus className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowNewFolder(true)}>
              <FolderPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {showNewFile && (
          <div className="mt-2 space-y-2">
            <Input
              placeholder="filename.mo"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFile()
                if (e.key === "Escape") setShowNewFile(false)
              }}
              autoFocus
            />
            <Select value={fileTemplate} onValueChange={setFileTemplate}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actor">Actor</SelectItem>
                <SelectItem value="module">Module</SelectItem>
                <SelectItem value="class">Class</SelectItem>
                <SelectItem value="library">Library</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button size="sm" onClick={handleCreateFile}>
                Create
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowNewFile(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {showNewFolder && (
          <div className="mt-2 space-y-2">
            <Input
              placeholder="folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder()
                if (e.key === "Escape") setShowNewFolder(false)
              }}
              autoFocus
            />
            <div className="flex gap-1">
              <Button size="sm" onClick={handleCreateFolder}>
                Create
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowNewFolder(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 p-2 overflow-auto">{renderFileTree(organizeFiles())}</div>

      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rename-input">New name</Label>
              <Input
                id="rename-input"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename()
                  if (e.key === "Escape") setShowRenameDialog(false)
                }}
                autoFocus
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRename}>Rename</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
