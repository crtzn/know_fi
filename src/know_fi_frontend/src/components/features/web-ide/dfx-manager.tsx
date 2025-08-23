'use client';

import { Copy, ExternalLink, Play, RefreshCw, Square } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CanisterInfo {
  name: string;
  id: string;
  status: 'running' | 'stopped' | 'building';
  type: 'motoko' | 'rust' | 'javascript';
  main?: string;
}

export function DfxManager() {
  const [replicaStatus, setReplicaStatus] = useState<'stopped' | 'starting' | 'running'>('stopped');
  const [canisters, setCanisters] = useState<CanisterInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In a real implementation, this would parse the actual dfx.json file
    const mockCanisters: CanisterInfo[] = [
      {
        name: 'main',
        id: 'rdmx6-jaaaa-aaaaa-aaadq-cai',
        status: 'stopped',
        type: 'motoko',
        main: 'src/main.mo',
      },
    ];
    setCanisters(mockCanisters);
  }, []);

  const startReplica = async () => {
    setIsLoading(true);
    setReplicaStatus('starting');

    // Simulate dfx start
    setTimeout(() => {
      setReplicaStatus('running');
      setCanisters((prev) => prev.map((c) => ({ ...c, status: 'running' })));
      setIsLoading(false);
      toast('Local Internet Computer replica is now running');
    }, 3000);
  };

  const stopReplica = async () => {
    setIsLoading(true);
    setReplicaStatus('stopped');
    setCanisters((prev) => prev.map((c) => ({ ...c, status: 'stopped' })));

    setTimeout(() => {
      setIsLoading(false);
      toast('Local Internet COmputer Replica has been stopped');
    }, 1000);
  };

  const deployCanister = async (canisterName: string) => {
    setIsLoading(true);
    setCanisters((prev) => prev.map((c) => (c.name === canisterName ? { ...c, status: 'building' } : c)));

    // Simulate deployment
    setTimeout(() => {
      setCanisters((prev) => prev.map((c) => (c.name === canisterName ? { ...c, status: 'running' } : c)));
      setIsLoading(false);
      toast(`Canister ${canisterName} deployed succesfully`);
    }, 2500);
  };

  const copyCanisterId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast('Canister ID copied to clipboard');
  };

  const openCandidUI = (canisterId: string) => {
    const url = `http://localhost:4943/_/candid?id=${canisterId}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>dfx Replica Status</span>
            <Badge variant={replicaStatus === 'running' ? 'default' : 'secondary'}>{replicaStatus}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {replicaStatus === 'stopped' ? (
              <Button onClick={startReplica} disabled={isLoading}>
                <Play className="mr-2 h-4 w-4" />
                Start Replica
              </Button>
            ) : (
              <Button onClick={stopReplica} disabled={isLoading} variant="destructive">
                <Square className="mr-2 h-4 w-4" />
                Stop Replica
              </Button>
            )}

            {replicaStatus === 'running' && (
              <Button variant="outline" onClick={() => window.open('http://localhost:4943/_/dashboard', '_blank')}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Canisters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {canisters.map((canister) => (
              <div key={canister.name} className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{canister.name}</span>
                    <Badge variant="outline">{canister.type}</Badge>
                    <Badge variant={canister.status === 'running' ? 'default' : 'secondary'}>{canister.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{canister.id}</div>
                  {canister.main && <div className="text-xs text-muted-foreground">Main: {canister.main}</div>}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => copyCanisterId(canister.id)}>
                    <Copy className="h-3 w-3" />
                  </Button>

                  {canister.status === 'running' && (
                    <Button size="sm" variant="outline" onClick={() => openCandidUI(canister.id)}>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}

                  <Button
                    size="sm"
                    onClick={() => deployCanister(canister.name)}
                    disabled={replicaStatus !== 'running' || isLoading}
                  >
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Deploy
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
