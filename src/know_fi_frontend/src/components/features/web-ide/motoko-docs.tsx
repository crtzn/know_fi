"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Book, Code, Zap } from "lucide-react"

interface DocItem {
  title: string
  category: "syntax" | "stdlib" | "patterns" | "examples"
  description: string
  code?: string
  tags: string[]
}

const motokoDocumentation: DocItem[] = [
  {
    title: "Actor Declaration",
    category: "syntax",
    description: "Actors are the main building blocks in Motoko. They can receive and respond to messages.",
    code: `actor MyActor {
  public func greet(name: Text) : async Text {
    return "Hello, " # name # "!";
  };
}`,
    tags: ["actor", "basic", "async"],
  },
  {
    title: "Query vs Update Functions",
    category: "patterns",
    description: "Query functions are read-only and faster. Update functions can modify state.",
    code: `// Query function (read-only, fast)
public query func getName() : async Text {
  return name;
};

// Update function (can modify state)
public func setName(newName: Text) : async () {
  name := newName;
};`,
    tags: ["query", "update", "state"],
  },
  {
    title: "Stable Variables",
    category: "patterns",
    description: "Stable variables persist across canister upgrades.",
    code: `stable var counter : Nat = 0;

public func increment() : async Nat {
  counter += 1;
  return counter;
};`,
    tags: ["stable", "upgrade", "persistence"],
  },
  {
    title: "HashMap Usage",
    category: "stdlib",
    description: "HashMap provides efficient key-value storage.",
    code: `import HashMap "mo:base/HashMap";
import Text "mo:base/Text";

let users = HashMap.HashMap<Text, Nat>(0, Text.equal, Text.hash);

public func addUser(name: Text, age: Nat) : async () {
  users.put(name, age);
};`,
    tags: ["hashmap", "storage", "data-structures"],
  },
  {
    title: "Result Type for Error Handling",
    category: "patterns",
    description: "Use Result type for functions that might fail.",
    code: `import Result "mo:base/Result";

public func divide(a: Float, b: Float) : async Result.Result<Float, Text> {
  if (b == 0) {
    #err("Division by zero")
  } else {
    #ok(a / b)
  }
};`,
    tags: ["result", "error-handling", "types"],
  },
  {
    title: "Array Operations",
    category: "stdlib",
    description: "Common array operations and transformations.",
    code: `import Array "mo:base/Array";

let numbers = [1, 2, 3, 4, 5];

// Map operation
let doubled = Array.map<Nat, Nat>(numbers, func(x) = x * 2);

// Filter operation
let evens = Array.filter<Nat>(numbers, func(x) = x % 2 == 0);`,
    tags: ["array", "map", "filter", "functional"],
  },
  {
    title: "Time and Timestamps",
    category: "stdlib",
    description: "Working with time in Motoko applications.",
    code: `import Time "mo:base/Time";

public func getCurrentTime() : async Int {
  return Time.now();
};

public func isRecent(timestamp: Int) : async Bool {
  let now = Time.now();
  let oneHour = 3_600_000_000_000; // nanoseconds
  return (now - timestamp) < oneHour;
};`,
    tags: ["time", "timestamp", "date"],
  },
  {
    title: "Principal and Caller",
    category: "patterns",
    description: "Working with user identities and authentication.",
    code: `import Principal "mo:base/Principal";

public shared(msg) func whoAmI() : async Principal {
  return msg.caller;
};

public shared(msg) func isOwner() : async Bool {
  let owner = Principal.fromText("rdmx6-jaaaa-aaaaa-aaadq-cai");
  return msg.caller == owner;
};`,
    tags: ["principal", "auth", "identity", "caller"],
  },
]

export function MotokoDocs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredDocs = motokoDocumentation.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "syntax":
        return <Code className="w-4 h-4" />
      case "stdlib":
        return <Book className="w-4 h-4" />
      case "patterns":
        return <Zap className="w-4 h-4" />
      case "examples":
        return <Search className="w-4 h-4" />
      default:
        return <Book className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "syntax":
        return "bg-blue-100 text-blue-800"
      case "stdlib":
        return "bg-green-100 text-green-800"
      case "patterns":
        return "bg-purple-100 text-purple-800"
      case "examples":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b space-y-3">
        <h3 className="font-semibold">Motoko Documentation</h3>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={selectedCategory === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory("all")}
          >
            All
          </Badge>
          <Badge
            variant={selectedCategory === "syntax" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory("syntax")}
          >
            Syntax
          </Badge>
          <Badge
            variant={selectedCategory === "stdlib" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory("stdlib")}
          >
            Standard Library
          </Badge>
          <Badge
            variant={selectedCategory === "patterns" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory("patterns")}
          >
            Patterns
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {filteredDocs.map((doc, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {getCategoryIcon(doc.category)}
                    {doc.title}
                  </CardTitle>
                  <Badge className={getCategoryColor(doc.category)}>{doc.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{doc.description}</p>
              </CardHeader>
              {doc.code && (
                <CardContent>
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                    <code>{doc.code}</code>
                  </pre>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {doc.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
