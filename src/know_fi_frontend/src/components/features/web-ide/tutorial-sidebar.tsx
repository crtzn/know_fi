'use client';

import { BookOpen, CheckCircle, Code, Play } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  code: string;
  explanation: string[];
  concepts: string[];
}

const tutorials: Tutorial[] = [
  {
    id: 'hello-world',
    title: 'Hello World',
    description: 'Learn the basics of Motoko actors and message passing',
    code: `actor HelloWorld {
  var greeting : Text = "Hello, ";

  public func setGreeting(prefix : Text) : async () {
    greeting := prefix;
  };

  public query func greet(name : Text) : async Text {
    return greeting # name # "!";
  };
}`,
    explanation: [
      'The code begins by defining an actor named HelloWorld. In Motoko, an actor is an object capable of maintaining state and communicating with other entities via message passing.',
      'It declares a variable called greeting that stores the greeting prefix.',
      "An update method named setGreeting is used to modify the canister's state. This method updates the value stored in greeting.",
      'A query method named greet is defined. Query methods are read-only and return information without changing state. This method concatenates the greeting with the input name.',
    ],
    concepts: ['Actors', 'Variables', 'Update Methods', 'Query Methods', 'Text Concatenation'],
  },
];

interface TutorialSidebarProps {
  onLoadTutorial: (code: string) => void;
  onRunCode: () => void;
  isDeploying: boolean;
}

export function TutorialSidebar({ onLoadTutorial, onRunCode, isDeploying }: TutorialSidebarProps) {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial>(tutorials[0]);

  const handleLoadTutorial = () => {
    onLoadTutorial(selectedTutorial.code);
  };

  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="border-b p-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <BookOpen className="size-5" />
          Motoko Tutorial
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Learn Motoko step by step</p>
      </div>

      <div className="flex-1 space-y-4 overflow-hidden p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              {selectedTutorial.title}
              <Badge variant="secondary">Beginner</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{selectedTutorial.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={handleLoadTutorial}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
              >
                <Code className="size-4" />
                Load Code
              </Button>
              <Button onClick={onRunCode} size="sm" disabled={isDeploying} className="flex items-center gap-2">
                <Play className="size-4" />
                {isDeploying ? 'Deploying...' : 'Run & Deploy'}
              </Button>
            </div>

            <div>
              <h4 className="mb-2 font-medium">What you&#39;ll learn:</h4>
              <div className="flex flex-wrap gap-1">
                {selectedTutorial.concepts.map((concept) => (
                  <Badge key={concept} variant="outline" className="text-xs">
                    {concept}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 font-medium">Explanation:</h4>
              <div className="space-y-3">
                {selectedTutorial.explanation.map((point, index) => (
                  <div key={index} className="flex gap-3 text-sm">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <p className="break-words leading-relaxed text-muted-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-muted p-3">
              <h4 className="mb-2 text-sm font-medium">💡 Quick Tip</h4>
              <p className="text-xs text-muted-foreground">
                Click &quot;Load Code&quot; to get the example, then &quot;Run &amp; Deploy&quot; to see it working in
                the dfx playground!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
