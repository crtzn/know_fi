"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Square, Trash2, Circle } from "lucide-react"

interface DfxProcess {
  id: string
  command: string
  status: "running" | "completed" | "failed"
  output: string[]
}

export function Terminal() {
  const [output, setOutput] = useState<string[]>([
    "Motoko Web IDE Terminal",
    'Type "help" for available dfx commands',
    "",
  ])
  const [command, setCommand] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [dfxStatus, setDfxStatus] = useState<"stopped" | "starting" | "running" | "error">("stopped")
  const [replicaUrl, setReplicaUrl] = useState<string>("")
  const [canisterIds, setCanisterIds] = useState<Record<string, string>>({})
  const [processes, setProcesses] = useState<DfxProcess[]>([])
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const addOutput = (text: string) => {
    setOutput((prev) => [...prev, text])
  }

  const executeDfxCommand = async (cmd: string, args: string[]) => {
    const fullCommand = `dfx ${args.join(" ")}`
    const processId = Date.now().toString()

    setProcesses((prev) => [
      ...prev,
      {
        id: processId,
        command: fullCommand,
        status: "running",
        output: [],
      },
    ])

    switch (args[0]) {
      case "start":
        setDfxStatus("starting")
        addOutput("Starting the local Internet Computer replica...")
        addOutput("Dashboard: http://localhost:4943/_/dashboard")

        setTimeout(() => {
          setDfxStatus("running")
          setReplicaUrl("http://localhost:4943")
          addOutput("✓ Replica started successfully")
          addOutput("✓ Webserver started at http://localhost:4943/")
          addOutput("✓ Bound to 127.0.0.1:4943")
          setProcesses((prev) => prev.map((p) => (p.id === processId ? { ...p, status: "completed" } : p)))
        }, 3000)
        break

      case "stop":
        setDfxStatus("stopped")
        setReplicaUrl("")
        setCanisterIds({})
        addOutput("Stopping the local Internet Computer replica...")
        addOutput("✓ Replica stopped")
        break

      case "deploy":
        if (dfxStatus !== "running") {
          addOutput("❌ Error: dfx replica is not running. Run 'dfx start' first.")
          return
        }

        addOutput("Deploying all canisters...")
        addOutput("Creating canisters...")
        addOutput("Building canisters...")

        setTimeout(() => {
          const mainCanisterId = `rdmx6-jaaaa-aaaaa-aaadq-cai`
          setCanisterIds((prev) => ({ ...prev, main: mainCanisterId }))
          addOutput("Installing code for canister main...")
          addOutput(`✓ Canister main deployed: ${mainCanisterId}`)
          addOutput(`URLs:`)
          addOutput(`  Frontend canister via browser`)
          addOutput(`    main: http://localhost:4943/?canisterId=${mainCanisterId}`)
          addOutput(`  Backend canister via Candid interface:`)
          addOutput(`    main: http://localhost:4943/_/candid?id=${mainCanisterId}`)
        }, 2500)
        break

      case "build":
        addOutput("Building all canisters...")
        addOutput("Building motoko canister 'main'...")
        setTimeout(() => {
          addOutput("✓ Build completed successfully")
        }, 1500)
        break

      case "canister":
        if (args[1] === "status") {
          if (Object.keys(canisterIds).length === 0) {
            addOutput("No canisters deployed")
          } else {
            addOutput("Canister status:")
            Object.entries(canisterIds).forEach(([name, id]) => {
              addOutput(`  ${name}: ${id} (Running)`)
            })
          }
        } else if (args[1] === "call") {
          const canisterName = args[2]
          const method = args[3]
          const canisterId = canisterIds[canisterName]

          if (!canisterId) {
            addOutput(`❌ Error: Canister '${canisterName}' not found`)
            return
          }

          addOutput(`Calling ${canisterName}.${method}...`)
          setTimeout(() => {
            addOutput(`✓ Result: ("Hello, World!")`)
          }, 1000)
        }
        break

      case "identity":
        if (args[1] === "whoami") {
          addOutput("default")
        } else if (args[1] === "get-principal") {
          addOutput("2vxsx-fae")
        }
        break

      case "wallet":
        if (args[1] === "balance") {
          addOutput("1000.000000000 ICP")
        }
        break

      default:
        addOutput(`dfx ${args.join(" ")} - command executed`)
    }
  }

  const executeCommand = async (cmd: string) => {
    addOutput(`$ ${cmd}`)

    const parts = cmd.trim().split(" ")
    const baseCmd = parts[0]

    switch (baseCmd) {
      case "help":
        addOutput("Available dfx commands:")
        addOutput("  dfx start          - Start local dfx replica")
        addOutput("  dfx stop           - Stop local dfx replica")
        addOutput("  dfx deploy         - Deploy all canisters")
        addOutput("  dfx build          - Build all canisters")
        addOutput("  dfx canister status - Show canister status")
        addOutput("  dfx canister call <name> <method> - Call canister method")
        addOutput("  dfx identity whoami - Show current identity")
        addOutput("  dfx wallet balance  - Show wallet balance")
        addOutput("  clear              - Clear terminal")
        addOutput("  status             - Show dfx environment status")
        break

      case "clear":
        setOutput(["Motoko Web IDE Terminal", ""])
        break

      case "status":
        addOutput("=== dfx Environment Status ===")
        addOutput(`Replica: ${dfxStatus}`)
        if (replicaUrl) addOutput(`URL: ${replicaUrl}`)
        addOutput(`Canisters: ${Object.keys(canisterIds).length}`)
        Object.entries(canisterIds).forEach(([name, id]) => {
          addOutput(`  ${name}: ${id}`)
        })
        break

      case "dfx":
        setIsRunning(true)
        await executeDfxCommand(cmd, parts.slice(1))
        setIsRunning(false)
        break

      default:
        addOutput(`Command not found: ${baseCmd}`)
        addOutput('Type "help" for available commands')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (command.trim() && !isRunning) {
      executeCommand(command)
      setCommand("")
    }
  }

  const stopExecution = () => {
    setIsRunning(false)
    addOutput("Process interrupted")
  }

  const getStatusColor = () => {
    switch (dfxStatus) {
      case "running":
        return "text-green-400"
      case "starting":
        return "text-yellow-400"
      case "error":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="h-full bg-black text-green-400 flex flex-col font-mono text-sm">
      <div className="flex items-center justify-between p-2 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">Terminal</span>
          <div className="flex items-center gap-1">
            <Circle className={`w-2 h-2 fill-current ${getStatusColor()}`} />
            <span className={`text-xs ${getStatusColor()}`}>dfx {dfxStatus}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setOutput(["Motoko Web IDE Terminal", ""])}
            className="h-6 w-6 p-0"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div ref={outputRef} className="flex-1 p-2 overflow-auto whitespace-pre-wrap">
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-2 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-green-400">$</span>
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter dfx command..."
            disabled={isRunning}
            className="bg-transparent border-none text-green-400 placeholder-green-600 focus:ring-0"
          />
          {isRunning ? (
            <Button type="button" size="sm" variant="destructive" onClick={stopExecution} className="h-6 w-6 p-0">
              <Square className="w-3 h-3" />
            </Button>
          ) : (
            <Button type="submit" size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Play className="w-3 h-3" />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
