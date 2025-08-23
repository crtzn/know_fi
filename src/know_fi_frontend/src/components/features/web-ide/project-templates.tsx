"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Zap, Coins, Users } from "lucide-react"

interface Template {
  id: string
  name: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  files: Record<string, string>
  features: string[]
  icon: React.ReactNode
}

const templates: Template[] = [
  {
    id: "hello-world",
    name: "Hello World",
    description: "A simple greeting actor to get started with Motoko",
    category: "Basic",
    difficulty: "Beginner",
    icon: <FileText className="w-5 h-5" />,
    features: ["Basic actor", "Public function", "Text return"],
    files: {
      "src/main.mo": `import Debug "mo:base/Debug";

actor HelloWorld {
  public func greet(name : Text) : async Text {
    Debug.print("Hello, " # name # "!");
    return "Hello, " # name # "!";
  };
}`,
      "dfx.json": `{
  "version": 1,
  "canisters": {
    "hello_world": {
      "type": "motoko",
      "main": "src/main.mo"
    }
  }
}`,
    },
  },
  {
    id: "counter",
    name: "Counter DApp",
    description: "A simple counter with increment/decrement functionality",
    category: "Basic",
    difficulty: "Beginner",
    icon: <Zap className="w-5 h-5" />,
    features: ["State management", "Query functions", "Update functions"],
    files: {
      "src/main.mo": `import Debug "mo:base/Debug";

actor Counter {
  private stable var count : Nat = 0;

  public query func get() : async Nat {
    count
  };

  public func increment() : async Nat {
    count += 1;
    Debug.print("Count incremented to: " # debug_show(count));
    count
  };

  public func decrement() : async Nat {
    if (count > 0) {
      count -= 1;
    };
    Debug.print("Count decremented to: " # debug_show(count));
    count
  };

  public func reset() : async Nat {
    count := 0;
    Debug.print("Count reset to: " # debug_show(count));
    count
  };
}`,
      "dfx.json": `{
  "version": 1,
  "canisters": {
    "counter": {
      "type": "motoko",
      "main": "src/main.mo"
    }
  }
}`,
    },
  },
  {
    id: "user-registry",
    name: "User Registry",
    description: "Manage user profiles with CRUD operations",
    category: "Social",
    difficulty: "Intermediate",
    icon: <Users className="w-5 h-5" />,
    features: ["HashMap storage", "User profiles", "CRUD operations"],
    files: {
      "src/main.mo": `import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Debug "mo:base/Debug";

actor UserRegistry {
  type User = {
    id: Text;
    name: Text;
    email: Text;
    createdAt: Int;
  };

  private stable var userEntries : [(Text, User)] = [];
  private var users = HashMap.HashMap<Text, User>(0, Text.equal, Text.hash);

  system func preupgrade() {
    userEntries := users.entries() |> Iter.toArray(_);
  };

  system func postupgrade() {
    users := HashMap.fromIter<Text, User>(userEntries.vals(), userEntries.size(), Text.equal, Text.hash);
    userEntries := [];
  };

  public func createUser(id: Text, name: Text, email: Text) : async Result.Result<User, Text> {
    switch (users.get(id)) {
      case (?existingUser) {
        #err("User with ID " # id # " already exists")
      };
      case null {
        let user : User = {
          id = id;
          name = name;
          email = email;
          createdAt = Time.now();
        };
        users.put(id, user);
        Debug.print("User created: " # id);
        #ok(user)
      };
    }
  };

  public query func getUser(id: Text) : async Result.Result<User, Text> {
    switch (users.get(id)) {
      case (?user) { #ok(user) };
      case null { #err("User not found") };
    }
  };

  public query func getAllUsers() : async [User] {
    users.vals() |> Iter.toArray(_)
  };
}`,
      "dfx.json": `{
  "version": 1,
  "canisters": {
    "user_registry": {
      "type": "motoko",
      "main": "src/main.mo"
    }
  }
}`,
    },
  },
  {
    id: "token-ledger",
    name: "Token Ledger",
    description: "Basic token implementation with transfer functionality",
    category: "DeFi",
    difficulty: "Advanced",
    icon: <Coins className="w-5 h-5" />,
    features: ["Token transfers", "Balance tracking", "Transaction history"],
    files: {
      "src/main.mo": `import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Debug "mo:base/Debug";

actor TokenLedger {
  type Account = Text;
  type Balance = Nat;
  type Transaction = {
    from: Account;
    to: Account;
    amount: Balance;
    timestamp: Int;
  };

  private stable var balanceEntries : [(Account, Balance)] = [];
  private stable var transactionHistory : [Transaction] = [];
  
  private var balances = HashMap.HashMap<Account, Balance>(0, Text.equal, Text.hash);
  private let tokenName = "MyToken";
  private let tokenSymbol = "MTK";
  private let totalSupply : Balance = 1000000;

  system func preupgrade() {
    balanceEntries := balances.entries() |> Iter.toArray(_);
  };

  system func postupgrade() {
    balances := HashMap.fromIter<Account, Balance>(balanceEntries.vals(), balanceEntries.size(), Text.equal, Text.hash);
    balanceEntries := [];
  };

  public func transfer(from: Account, to: Account, amount: Balance) : async Result.Result<(), Text> {
    let fromBalance = switch (balances.get(from)) {
      case (?balance) { balance };
      case null { 0 };
    };

    if (fromBalance < amount) {
      return #err("Insufficient balance");
    };

    let toBalance = switch (balances.get(to)) {
      case (?balance) { balance };
      case null { 0 };
    };

    balances.put(from, fromBalance - amount);
    balances.put(to, toBalance + amount);

    let transaction : Transaction = {
      from = from;
      to = to;
      amount = amount;
      timestamp = Time.now();
    };

    transactionHistory := Array.append(transactionHistory, [transaction]);
    Debug.print("Transfer completed: " # debug_show(amount) # " from " # from # " to " # to);
    #ok(())
  };

  public query func balanceOf(account: Account) : async Balance {
    switch (balances.get(account)) {
      case (?balance) { balance };
      case null { 0 };
    }
  };

  public query func getTransactionHistory() : async [Transaction] {
    transactionHistory
  };
}`,
      "dfx.json": `{
  "version": 1,
  "canisters": {
    "token_ledger": {
      "type": "motoko",
      "main": "src/main.mo"
    }
  }
}`,
    },
  },
]

interface ProjectTemplatesProps {
  onTemplateSelect?: (template: Template) => void
}

export function ProjectTemplates({ onTemplateSelect }: ProjectTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const categories = Array.from(new Set(templates.map((t) => t.category)))

  const handleUseTemplate = (template: Template) => {
    if (onTemplateSelect) {
      onTemplateSelect(template)
    } else {
      // Default behavior - could integrate with file system
      console.log("Using template:", template.name)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose a Project Template</h2>
        <p className="text-muted-foreground">Start your Motoko project with a proven template</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category.toLowerCase()}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={() => setSelectedTemplate(template)}
                onUse={() => handleUseTemplate(template)}
              />
            ))}
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category.toLowerCase()} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates
                .filter((t) => t.category === category)
                .map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={() => setSelectedTemplate(template)}
                    onUse={() => handleUseTemplate(template)}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {selectedTemplate && (
        <div className="mt-8 p-6 border rounded-lg bg-card">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {selectedTemplate.icon}
              <div>
                <h3 className="text-xl font-semibold">{selectedTemplate.name}</h3>
                <p className="text-muted-foreground">{selectedTemplate.description}</p>
              </div>
            </div>
            <Badge
              variant={
                selectedTemplate.difficulty === "Beginner"
                  ? "default"
                  : selectedTemplate.difficulty === "Intermediate"
                    ? "secondary"
                    : "destructive"
              }
            >
              {selectedTemplate.difficulty}
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Features:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.features.map((feature) => (
                  <Badge key={feature} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Files included:</h4>
              <div className="space-y-2">
                {Object.keys(selectedTemplate.files).map((filename) => (
                  <div key={filename} className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {filename}
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={() => handleUseTemplate(selectedTemplate)} className="w-full">
              Use This Template
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

interface TemplateCardProps {
  template: Template
  onSelect: () => void
  onUse: () => void
}

function TemplateCard({ template, onSelect, onUse }: TemplateCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onSelect}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {template.icon}
            <CardTitle className="text-lg">{template.name}</CardTitle>
          </div>
          <Badge
            variant={
              template.difficulty === "Beginner"
                ? "default"
                : template.difficulty === "Intermediate"
                  ? "secondary"
                  : "destructive"
            }
          >
            {template.difficulty}
          </Badge>
        </div>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {template.features.slice(0, 3).map((feature) => (
              <Badge key={feature} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {template.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{template.features.length - 3} more
              </Badge>
            )}
          </div>
          <Button
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation()
              onUse()
            }}
          >
            Use Template
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
