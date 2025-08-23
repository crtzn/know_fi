"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Play, CheckCircle, XCircle, Clock, AlertTriangle, ExternalLink } from "lucide-react"

interface DeploymentStep {
  id: string
  name: string
  status: "pending" | "running" | "completed" | "failed"
  duration?: number
  output: string[]
  error?: string
}

interface DeploymentJob {
  id: string
  timestamp: Date
  status: "running" | "completed" | "failed"
  steps: DeploymentStep[]
  canisterIds: Record<string, string>
  network: "local" | "ic"
}

export function DeploymentPipeline() {
  const [currentJob, setCurrentJob] = useState<DeploymentJob | null>(null)
  const [deploymentHistory, setDeploymentHistory] = useState<DeploymentJob[]>([])
  const [isDeploying, setIsDeploying] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState<"local" | "ic">("local")

  const createDeploymentSteps = (network: "local" | "ic"): DeploymentStep[] => [
    {
      id: "validate",
      name: "Validate Project",
      status: "pending",
      output: [],
    },
    {
      id: "build",
      name: "Build Canisters",
      status: "pending",
      output: [],
    },
    {
      id: "optimize",
      name: "Optimize Code",
      status: "pending",
      output: [],
    },
    ...(network === "ic"
      ? [
          {
            id: "cycles",
            name: "Check Cycles",
            status: "pending" as const,
            output: [],
          },
        ]
      : []),
    {
      id: "deploy",
      name: "Deploy to Network",
      status: "pending",
      output: [],
    },
    {
      id: "verify",
      name: "Verify Deployment",
      status: "pending",
      output: [],
    },
  ]

  const executeStep = async (job: DeploymentJob, stepId: string): Promise<void> => {
    return new Promise((resolve) => {
      const step = job.steps.find((s) => s.id === stepId)
      if (!step) return resolve()

      step.status = "running"
      setCurrentJob({ ...job })

      const startTime = Date.now()

      setTimeout(
        () => {
          step.duration = Date.now() - startTime

          switch (stepId) {
            case "validate":
              step.output = [
                "✓ Checking dfx.json configuration",
                "✓ Validating Motoko syntax",
                "✓ Checking dependencies",
                "✓ Project structure validated",
              ]
              step.status = "completed"
              break

            case "build":
              step.output = [
                "Building motoko canister 'main'...",
                "Compiling src/main.mo",
                "Generating Candid interface",
                "✓ Build completed successfully",
              ]
              step.status = "completed"
              break

            case "optimize":
              step.output = [
                "Optimizing canister code...",
                "Reducing WASM size",
                "✓ Code optimized (15% size reduction)",
              ]
              step.status = "completed"
              break

            case "cycles":
              step.output = [
                "Checking wallet balance...",
                "Current balance: 2.5 TC",
                "Estimated deployment cost: 0.1 TC",
                "✓ Sufficient cycles available",
              ]
              step.status = "completed"
              break

            case "deploy":
              const canisterId =
                selectedNetwork === "local" ? "rdmx6-jaaaa-aaaaa-aaadq-cai" : "rrkah-fqaaa-aaaah-qcwwa-cai"

              job.canisterIds.main = canisterId
              step.output = [
                `Deploying to ${selectedNetwork === "local" ? "local replica" : "Internet Computer"}...`,
                "Installing code for canister main",
                `✓ Canister deployed: ${canisterId}`,
                selectedNetwork === "local"
                  ? `Frontend: http://localhost:4943/?canisterId=${canisterId}`
                  : `Frontend: https://${canisterId}.ic0.app`,
              ]
              step.status = "completed"
              break

            case "verify":
              step.output = [
                "Verifying canister deployment...",
                "Testing canister methods",
                "✓ All methods responding correctly",
                "✓ Deployment verified successfully",
              ]
              step.status = "completed"
              break

            default:
              step.status = "failed"
              step.error = "Unknown step"
          }

          setCurrentJob({ ...job })
          resolve()
        },
        Math.random() * 2000 + 1000,
      ) // 1-3 seconds per step
    })
  }

  const startDeployment = async () => {
    setIsDeploying(true)

    const job: DeploymentJob = {
      id: Date.now().toString(),
      timestamp: new Date(),
      status: "running",
      steps: createDeploymentSteps(selectedNetwork),
      canisterIds: {},
      network: selectedNetwork,
    }

    setCurrentJob(job)

    try {
      for (const step of job.steps) {
        await executeStep(job, step.id)
      }

      job.status = "completed"
      setDeploymentHistory((prev) => [job, ...prev])
    } catch (error) {
      job.status = "failed"
      setDeploymentHistory((prev) => [job, ...prev])
    }

    setIsDeploying(false)
    setCurrentJob(null)
  }

  const getStepIcon = (status: DeploymentStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "running":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getJobStatusBadge = (status: DeploymentJob["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>
    }
  }

  const calculateProgress = (steps: DeploymentStep[]) => {
    const completed = steps.filter((s) => s.status === "completed").length
    return (completed / steps.length) * 100
  }

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Deployment Pipeline</span>
            <div className="flex items-center gap-2">
              <Button
                variant={selectedNetwork === "local" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedNetwork("local")}
              >
                Local
              </Button>
              <Button
                variant={selectedNetwork === "ic" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedNetwork("ic")}
              >
                IC Mainnet
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedNetwork === "ic" && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Deploying to IC Mainnet requires cycles and will incur costs. Make sure you have sufficient balance.
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={startDeployment} disabled={isDeploying} className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Deploy to {selectedNetwork === "local" ? "Local Replica" : "IC Mainnet"}
            </Button>

            {currentJob && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Deployment Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(calculateProgress(currentJob.steps))}%
                  </span>
                </div>
                <Progress value={calculateProgress(currentJob.steps)} />

                <div className="space-y-2">
                  {currentJob.steps.map((step) => (
                    <div key={step.id} className="flex items-center gap-3 p-2 rounded border">
                      {getStepIcon(step.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{step.name}</span>
                          {step.duration && <span className="text-xs text-muted-foreground">{step.duration}ms</span>}
                        </div>
                        {step.output.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {step.output[step.output.length - 1]}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Deployment History</TabsTrigger>
          <TabsTrigger value="logs">Detailed Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Deployments</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {deploymentHistory.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getJobStatusBadge(job.status)}
                          <Badge variant="outline">{job.network}</Badge>
                          <span className="text-sm text-muted-foreground">{job.timestamp.toLocaleString()}</span>
                        </div>
                        {Object.entries(job.canisterIds).map(([name, id]) => (
                          <div key={name} className="text-xs text-muted-foreground">
                            {name}: {id}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        {job.network === "local" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(`http://localhost:4943/_/candid?id=${job.canisterIds.main}`, "_blank")
                            }
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`https://${job.canisterIds.main}.ic0.app`, "_blank")}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {deploymentHistory.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No deployments yet. Start your first deployment above.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2 font-mono text-sm">
                  {currentJob ? (
                    currentJob.steps.map((step) => (
                      <div key={step.id} className="space-y-1">
                        <div className="font-semibold text-blue-600">
                          [{step.status.toUpperCase()}] {step.name}
                        </div>
                        {step.output.map((line, index) => (
                          <div key={index} className="text-muted-foreground pl-4">
                            {line}
                          </div>
                        ))}
                        {step.error && <div className="text-red-600 pl-4">ERROR: {step.error}</div>}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No active deployment. Start a deployment to see logs.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
