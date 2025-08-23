'use client';

import { Copy, ExternalLink, Play, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface CanisterMethod {
  name: string;
  type: 'query' | 'update';
  args: Array<{ name: string; type: string }>;
  returnType: string;
}

export function CanisterInspector() {
  const [canisterId, setCanisterId] = useState('rdmx6-jaaaa-aaaaa-aaadq-cai');
  const [methods, setMethods] = useState<CanisterMethod[]>([
    {
      name: 'greet',
      type: 'query',
      args: [{ name: 'name', type: 'Text' }],
      returnType: 'Text',
    },
  ]);
  const [selectedMethod, setSelectedMethod] = useState<CanisterMethod | null>(null);
  const [methodArgs, setMethodArgs] = useState<Record<string, string>>({});
  const [callResult, setCallResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const callCanisterMethod = async () => {
    if (!selectedMethod) return;

    setIsLoading(true);
    setCallResult('');

    // Simulate canister call
    setTimeout(() => {
      const mockResults: Record<string, string> = {
        greet: `"Hello, ${methodArgs.name || 'World'}!"`,
        getName: `"Default Name"`,
        getCounter: '42',
        increment: '43',
      };

      setCallResult(mockResults[selectedMethod.name] || 'null');
      setIsLoading(false);

      toast('Method Called');
      toast.success(`Successfully called ${selectedMethod.name}`);
      toast.error('Something went wrong');
    }, 1500);
  };

  const copyCanisterId = () => {
    navigator.clipboard.writeText(canisterId);
    toast('Canister ID copied to clipboard');
  };

  const openCandidUI = () => {
    window.open(`http://localhost:4943/_/candid?id=${canisterId}`, '_blank');
  };

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Canister Inspector</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="canister-id">Canister ID</Label>
              <Input
                id="canister-id"
                value={canisterId}
                onChange={(e) => setCanisterId(e.target.value)}
                placeholder="Enter canister ID"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={copyCanisterId}>
                <Copy className="size-4" />
              </Button>
              <Button variant="outline" onClick={openCandidUI}>
                <ExternalLink className="size-4" />
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="methods" className="space-y-4">
        <TabsList>
          <TabsTrigger value="methods">Methods</TabsTrigger>
          <TabsTrigger value="state">State</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="methods">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Available Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {methods.map((method) => (
                      <div
                        key={method.name}
                        className={`cursor-pointer rounded border p-3 transition-colors ${
                          selectedMethod?.name === method.name ? 'border-primary bg-accent' : 'hover:bg-accent/50'
                        }`}
                        onClick={() => setSelectedMethod(method)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{method.name}</span>
                          <Badge variant={method.type === 'query' ? 'secondary' : 'default'}>{method.type}</Badge>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          ({method.args.map((arg) => `${arg.name}: ${arg.type}`).join(', ')}) → {method.returnType}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Method Call</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedMethod ? (
                  <>
                    <div>
                      <Label>Method: {selectedMethod.name}</Label>
                      <div className="text-sm text-muted-foreground">
                        Type: {selectedMethod.type} | Returns: {selectedMethod.returnType}
                      </div>
                    </div>

                    {selectedMethod.args.map((arg) => (
                      <div key={arg.name}>
                        <Label htmlFor={arg.name}>
                          {arg.name} ({arg.type})
                        </Label>
                        <Input
                          id={arg.name}
                          value={methodArgs[arg.name] || ''}
                          onChange={(e) =>
                            setMethodArgs((prev) => ({
                              ...prev,
                              [arg.name]: e.target.value,
                            }))
                          }
                          placeholder={`Enter ${arg.type.toLowerCase()} value`}
                        />
                      </div>
                    ))}

                    <Button onClick={callCanisterMethod} disabled={isLoading} className="w-full">
                      <Play className="mr-2 h-4 w-4" />
                      {isLoading ? 'Calling...' : 'Call Method'}
                    </Button>

                    {callResult && (
                      <div>
                        <Label>Result</Label>
                        <Textarea value={callResult} readOnly className="font-mono text-sm" rows={3} />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">Select a method to call</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="state">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Canister State</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <div className="text-sm">Running</div>
                  </div>
                  <div>
                    <Label>Memory Usage</Label>
                    <div className="text-sm">1.2 MB</div>
                  </div>
                  <div>
                    <Label>Cycles Balance</Label>
                    <div className="text-sm">1,234,567,890</div>
                  </div>
                  <div>
                    <Label>Module Hash</Label>
                    <div className="font-mono text-sm">0x1a2b3c...</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Canister Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-muted-foreground">[2024-01-15 10:30:15] Canister started</div>
                  <div className="text-muted-foreground">
                    [2024-01-15 10:30:16] Method &#39;greet&#39; called with args: (&quot;Alice&quot;)
                  </div>
                  <div className="text-muted-foreground">[2024-01-15 10:30:16] Debug: Hello, Alice!</div>
                  <div className="text-muted-foreground">
                    [2024-01-15 10:30:17] Method &#39;greet&#39; returned: &quot;Hello, Alice!&quot;
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
