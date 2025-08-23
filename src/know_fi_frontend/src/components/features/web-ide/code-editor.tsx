"use client"

import { useRef } from "react"
import Editor from "@monaco-editor/react"

interface CodeEditorProps {
  file: string
  content: string
  onChange: (content: string) => void
}

export function CodeEditor({ file, content, onChange }: CodeEditorProps) {
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    monaco.languages.register({ id: "motoko" })

    monaco.languages.setMonarchTokensProvider("motoko", {
      tokenizer: {
        root: [
          // Keywords
          [
            /\b(actor|class|func|public|private|query|update|import|module|type|let|var|if|else|switch|case|while|for|in|return|async|await|try|catch|throw|assert|debug_show|stable|flexible|system|shared|composite|oneway)\b/,
            "keyword",
          ],
          // Control flow
          [/\b(break|continue|loop|label)\b/, "keyword.control"],
          // Types
          [
            /\b(Text|Nat|Nat8|Nat16|Nat32|Nat64|Int|Int8|Int16|Int32|Int64|Bool|Float|Char|Blob|Principal|Time|Array|Buffer|HashMap|TrieMap|Result|Option|Iter|List|Trie|Any|None|Null|Debug|ExperimentalCycles|ExperimentalStableMemory|ExperimentalInternetComputer)\b/,
            "type",
          ],
          // Built-in functions and modules
          [/\b(mo:base\/[A-Za-z]+|mo:matchers\/[A-Za-z]+|mo:[A-Za-z/]+)\b/, "string.escape"],
          // Constants
          [/\b(true|false|null)\b/, "constant.language"],
          // Numbers
          [/\b\d+(_\d+)*\b/, "number"],
          [/\b0x[0-9a-fA-F]+(_[0-9a-fA-F]+)*\b/, "number.hex"],
          [/\b\d+(_\d+)*\.\d+(_\d+)*([eE][+-]?\d+(_\d+)*)?\b/, "number.float"],
          // Strings
          [/"([^"\\]|\\.)*$/, "string.invalid"],
          [/"/, "string", "@string"],
          [/'([^'\\]|\\.)+'/, "string.char"],
          // Comments
          [/\/\/.*$/, "comment"],
          [/\/\*/, "comment", "@comment"],
          // Operators
          [/[<>]=?|[!=]=?|&&|\|\||[+\-*/%]|:=|->|<-|\?|\|/, "operator"],
          // Delimiters
          [/[{}()[\]]/, "delimiter.bracket"],
          [/[;,.]/, "delimiter"],
          // Identifiers
          [/[a-zA-Z_][a-zA-Z0-9_]*/, "identifier"],
          // Whitespace
          [/\s+/, "white"],
        ],
        string: [
          [/[^\\"]+/, "string"],
          [/\\./, "string.escape"],
          [/"/, "string", "@pop"],
        ],
        comment: [
          [/[^/*]+/, "comment"],
          [/\*\//, "comment", "@pop"],
          [/[/*]/, "comment"],
        ],
      },
    })

    monaco.languages.setLanguageConfiguration("motoko", {
      comments: {
        lineComment: "//",
        blockComment: ["/*", "*/"],
      },
      brackets: [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"],
      ],
      autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
      surroundingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
      folding: {
        markers: {
          start: /^\s*\/\/\s*#?region\b/,
          end: /^\s*\/\/\s*#?endregion\b/,
        },
      },
      wordPattern: /[a-zA-Z_][a-zA-Z0-9_]*/,
      indentationRules: {
        increaseIndentPattern: /^.*\{[^}]*$/,
        decreaseIndentPattern: /^.*\}.*$/,
      },
    })

    monaco.languages.registerCompletionItemProvider("motoko", {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        }

        const suggestions = [
          {
            label: "actor",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "actor ${1:ActorName} {\n\t$0\n}",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Create a new actor",
            range,
          },
          {
            label: "func",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: "public func ${1:functionName}(${2:params}) : ${3:ReturnType} {\n\t$0\n}",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: "Create a public function",
            range,
          },
          {
            label: "import Debug",
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'import Debug "mo:base/Debug";',
            documentation: "Import Debug module",
            range,
          },
        ]

        return { suggestions }
      },
    })
  }

  const getLanguage = (filename: string) => {
    if (filename.endsWith(".mo")) return "motoko"
    if (filename.endsWith(".json")) return "json"
    if (filename.endsWith(".js") || filename.endsWith(".ts")) return "typescript"
    return "plaintext"
  }

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language={getLanguage(file)}
        value={content}
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          cursorStyle: "line",
          wordWrap: "on",
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          tabCompletion: "on",
          wordBasedSuggestions: "matchingDocuments",
          parameterHints: { enabled: true },
          autoIndent: "full",
          formatOnPaste: true,
          formatOnType: true,
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          folding: true,
          foldingStrategy: "indentation",
          showFoldingControls: "always",
        }}
      />
    </div>
  )
}
