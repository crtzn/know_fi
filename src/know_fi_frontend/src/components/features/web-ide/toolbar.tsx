'use client';

import { Download, FileText, Rocket, Server, Settings, Upload, Zap } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { DeploymentPipeline } from './deployment-pipeline';
import { DfxManager } from './dfx-manager';
import { ProjectTemplates } from './project-templates';

export function Toolbar() {
  const [showDfxManager, setShowDfxManager] = useState(false);
  const [showDeploymentPipeline, setShowDeploymentPipeline] = useState(false);
  const [showProjectTemplates, setShowProjectTemplates] = useState(false);

  return (
    <div className="flex h-12 items-center justify-between border-b bg-card px-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-500" />
          <span className="font-semibold">Motoko IDE</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Dialog open={showProjectTemplates} onOpenChange={setShowProjectTemplates}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <FileText className="mr-1 h-4 w-4" />
              Templates
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] max-w-6xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Project Templates</DialogTitle>
            </DialogHeader>
            <ProjectTemplates />
          </DialogContent>
        </Dialog>

        <Button size="sm" variant="outline">
          <Upload className="mr-1 h-4 w-4" />
          Import
        </Button>

        <Button size="sm" variant="outline">
          <Download className="mr-1 h-4 w-4" />
          Export
        </Button>

        <div className="mx-2 h-6 w-px bg-border" />

        <Dialog open={showDeploymentPipeline} onOpenChange={setShowDeploymentPipeline}>
          <DialogTrigger asChild>
            <Button size="sm" variant="default">
              <Rocket className="mr-1 h-4 w-4" />
              Deploy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Deployment Pipeline</DialogTitle>
            </DialogHeader>
            <DeploymentPipeline />
          </DialogContent>
        </Dialog>

        <Dialog open={showDfxManager} onOpenChange={setShowDfxManager}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Server className="mr-1 h-4 w-4" />
              dfx Manager
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>dfx Local Environment Manager</DialogTitle>
            </DialogHeader>
            <DfxManager />
          </DialogContent>
        </Dialog>

        <Button size="sm" variant="ghost">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
