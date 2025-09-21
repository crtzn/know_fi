# 📚 KnowFi API Documentation

This document provides comprehensive information about KnowFi's canister APIs, including how to integrate with the platform and interact with its various services.

## 🏗️ Architecture Overview

KnowFi consists of 7 main backend canisters, each handling specific functionality:

- **Authentication (`auth`)** - User authentication and role management
- **Profile (`profile`)** - User profile management
- **Courses (`courses`)** - Course creation, approval, and management
- **Quiz (`quiz`)** - Quiz system and gamification
- **Quests (`quests`)** - Daily quests and challenges
- **Forum (`forum`)** - Community discussions
- **ICRC7 (`icrc7`)** - NFT minting and management

## 🔐 Authentication Canister (`auth`)

Manages user authentication and role-based access control.

### Types

```motoko
type Role = {
  #owner;
  #admin;
};
```

### Public Methods

#### `initializeOwner() : async Result<Text, Text>`

Initializes the contract owner (can only be called once).

**Example:**

```bash
dfx canister call auth initializeOwner
```

#### `assignRole(user: Principal, role: Role) : async Result<Text, Text>`

Assigns a role to a user (owner/admin only).

**Example:**

```bash
dfx canister call auth assignRole '(principal "rrkah-fqaaa-aaaaa-aaaaq-cai", variant { admin })'
```

#### `getUserRole(user: Principal) : async ?Role`

Gets the role of a specific user.

**Example:**

```bash
dfx canister call auth getUserRole '(principal "rrkah-fqaaa-aaaaa-aaaaq-cai")'
```

#### `hasRole(user: Principal, role: Role) : async Bool`

Checks if a user has a specific role.

**Example:**

```bash
dfx canister call auth hasRole '(principal "rrkah-fqaaa-aaaaa-aaaaq-cai", variant { admin })'
```

---

## 👤 Profile Canister (`profile`)

Manages user profiles and social features.

### Types

```motoko
type UserProfile = {
  principal_id: Principal;
  username: Text;
  display_name: Text;
  bio: ?Text;
  avatar_url: ?Text;
  social_links: {
    twitter: ?Text;
    linkedin: ?Text;
    github: ?Text;
    website: ?Text;
  };
  preferences: {
    categories: [Text];
    notification_settings: Bool;
  };
  stats: {
    courses_completed: Nat;
    quizzes_completed: Nat;
    total_tokens_earned: Nat;
    streak_days: Nat;
  };
  created_at: Int;
  updated_at: Int;
};
```

### Public Methods

#### `createProfile(profile: UserProfile) : async Result<(), Text>`

Creates a new user profile.

#### `getProfile() : async ?UserProfile`

Gets the current user's profile.

#### `updateProfile(profile: UserProfile) : async Result<(), Text>`

Updates the current user's profile.

#### `getUserByUsername(username: Text) : async ?UserProfile`

Gets a user profile by username.

---

## 📚 Courses Canister (`courses`)

Manages course creation, approval, and content delivery.

### Types

```motoko
type Course = {
  id: Nat;
  title: Text;
  description: Text;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  thumbnail_url: ?Text;
  creator: CourseCreator;
  content: CourseContent;
  token_reward: Nat;
  price_tokens: Nat;
  status: CourseStatus;
  created_at: Int;
  updated_at: Int;
  approved_at: ?Int;
  approved_by: ?Principal;
  tags: [Text];
  student_count: Nat;
  rating: Float;
  review_count: Nat;
};

type CourseCategory = {
  #blockchain; #trading; #ai; #motoko;
  #icp; #defi; #nft; #web3;
  #programming; #other;
};

type CourseDifficulty = {
  #beginner; #intermediate;
  #advanced; #expert;
};

type CourseStatus = {
  #pending; #under_review;
  #approved; #rejected;
};
```

### Public Methods

#### `createCourse(submission: CourseSubmission) : async Result<Nat, Text>`

Creates a new course (returns course ID).

**Example:**

```javascript
const courseSubmission = {
  title: "Introduction to Motoko",
  description: "Learn the basics of Motoko programming",
  category: { motoko: null },
  difficulty: { beginner: null },
  thumbnail_url: ["https://example.com/thumb.jpg"],
  creator_info: {
    name: "John Doe",
    bio: ["Expert Motoko developer"],
    linkedin: ["https://linkedin.com/in/johndoe"],
    github: ["https://github.com/johndoe"],
    website: [],
    portfolio: []
  },
  content: {
    sections: [...],
    estimated_duration_hours: 5,
    prerequisites: [],
    learning_objectives: ["Understand Motoko basics"]
  },
  token_reward: 100,
  price_tokens: 50,
  tags: ["motoko", "beginner", "programming"]
};

await courses.createCourse(courseSubmission);
```

#### `getCourses() : async [Course]`

Gets all approved courses.

#### `getCourseById(courseId: Nat) : async ?Course`

Gets a specific course by ID.

#### `getCoursesByCategory(category: Text) : async [Course]`

Gets courses by category.

#### `getCoursesByCreator(creatorId: Principal) : async [Course]`

Gets all courses by a specific creator.

#### `searchCourses(searchQuery: Text) : async [Course]`

Searches courses by title or description.

### Admin Methods

#### `approveCourse(courseId: Nat) : async Result<(), Text>`

Approves a course (admin only).

#### `rejectCourse(courseId: Nat, reason: ?Text) : async Result<(), Text>`

Rejects a course (admin only).

#### `getCoursesForApproval() : async [Course]`

Gets all courses pending approval (admin only).

---

## 🧩 Quiz Canister (`quiz`)

Manages the quiz system, gamification, and token rewards.

### Types

```motoko
type Quiz = {
  id: Nat;
  question: Text;
  options: [Text];
  correct_answer: Text;
  category: Text;
  difficulty: QuizDifficulty;
  explanation: ?Text;
  created_at: Int;
};

type QuizResult = {
  quiz_id: Nat;
  user_answer: Text;
  is_correct: Bool;
  timestamp: Int;
};
```

### Public Methods

#### `getRandomQuiz(category: ?Text) : async ?Quiz`

Gets a random quiz question, optionally filtered by category.

#### `submitQuizAnswer(quizId: Nat, answer: Text) : async Result<Bool, Text>`

Submits an answer to a quiz question.

#### `getUserQuizHistory() : async [QuizResult]`

Gets the current user's quiz history.

#### `getUserTokenBalance() : async Nat`

Gets the current user's token balance.

#### `addTokenReward(user: Principal, amount: Nat) : async ()`

Adds token rewards to a user (internal use).

---

## 🎯 Quests Canister (`quests`)

Manages daily quests and special challenges.

### Public Methods

#### `completeQuest() : async Bool`

Completes a quest and rewards the user with tokens.

**Example:**

```javascript
// Complete a quest (awards 10 tokens)
const result = await quests.completeQuest();
```

#### `dailyClaim() : async Bool`

Claims daily reward tokens.

**Example:**

```javascript
// Claim daily rewards (awards 5 tokens)
const result = await quests.dailyClaim();
```

#### `referralFriend() : async ()`

Rewards user for referring a friend.

---

## 💬 Forum Canister (`forum`)

Manages community discussions and posts.

### Types

```motoko
type Post = {
  id: Nat;
  author: Principal;
  title: Text;
  content: Text;
  category: Text;
  tags: [Text];
  upvotes: Nat;
  downvotes: Nat;
  replies: [Reply];
  created_at: Int;
  updated_at: Int;
};

type Reply = {
  id: Nat;
  author: Principal;
  content: Text;
  upvotes: Nat;
  downvotes: Nat;
  created_at: Int;
};
```

### Public Methods

#### `createPost(title: Text, content: Text, category: Text, tags: [Text]) : async Result<Nat, Text>`

Creates a new forum post.

#### `getPosts() : async [Post]`

Gets all forum posts.

#### `getPostById(postId: Nat) : async ?Post`

Gets a specific post by ID.

#### `addReply(postId: Nat, content: Text) : async Result<Nat, Text>`

Adds a reply to a post.

#### `upvotePost(postId: Nat) : async Result<(), Text>`

Upvotes a post.

---

## 🎨 ICRC7 Canister (`icrc7`)

Manages NFT certificates and achievements.

### Types

```motoko
type NFTMetadata = {
  name: Text;
  description: Text;
  image: Text;
  attributes: [(Text, Text)];
};
```

### Public Methods

#### `mint(to: Principal, metadata: NFTMetadata) : async Result<Nat, Text>`

Mints a new NFT certificate.

#### `getTokenMetadata(tokenId: Nat) : async ?NFTMetadata`

Gets metadata for a specific NFT.

#### `getUserTokens(user: Principal) : async [Nat]`

Gets all NFT token IDs owned by a user.

---

## 🔌 Frontend Integration

### Setting up the Actor

```typescript
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";

// Initialize auth client
const authClient = await AuthClient.create();

// Create agent
const agent = new HttpAgent({
  host:
    process.env.NODE_ENV === "development"
      ? "http://localhost:4943"
      : "https://ic0.app",
});

// Create actors for each canister
const courses = Actor.createActor(coursesIdlFactory, {
  agent,
  canisterId: process.env.COURSES_CANISTER_ID,
});
```

### Example React Hook

```typescript
import { useAuth } from "@/contexts/AuthContext";

export function useCourses() {
  const { actors } = useAuth();

  const getCourses = async () => {
    try {
      const courses = await actors.courses.getCourses();
      return courses;
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      return [];
    }
  };

  const createCourse = async (courseData) => {
    try {
      const result = await actors.courses.createCourse(courseData);
      if ("ok" in result) {
        return result.ok;
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error("Failed to create course:", error);
      throw error;
    }
  };

  return { getCourses, createCourse };
}
```

### Error Handling

```typescript
// Standard error handling pattern
try {
  const result = await actors.courses.createCourse(courseData);

  if ("ok" in result) {
    // Success
    console.log("Course created with ID:", result.ok);
  } else {
    // Error
    console.error("Failed to create course:", result.err);
  }
} catch (error) {
  // Network or other errors
  console.error("Network error:", error);
}
```

## 🧪 Testing APIs

### Using DFX CLI

```bash
# Test course creation
dfx canister call courses createCourse '(record {
  title = "Test Course";
  description = "A test course";
  category = variant { programming };
  difficulty = variant { beginner };
  thumbnail_url = opt "https://example.com/thumb.jpg";
  creator_info = record {
    name = "Test Creator";
    bio = opt "Test bio";
    linkedin = opt "https://linkedin.com/test";
    github = opt "https://github.com/test";
    website = null;
    portfolio = null;
  };
  content = record {
    sections = vec {};
    estimated_duration_hours = 2;
    prerequisites = vec {};
    learning_objectives = vec { "Learn basics" };
  };
  token_reward = 50;
  price_tokens = 25;
  tags = vec { "test"; "beginner" };
})'

# Get all courses
dfx canister call courses getCourses

# Get user profile
dfx canister call profile getProfile
```

### Using Candid UI

1. Start your local replica: `dfx start`
2. Deploy canisters: `dfx deploy`
3. Access Candid UI at: `http://localhost:4943/_/candid?canisterId=<CANISTER_ID>`

## 🔒 Security Considerations

### Authentication

- All write operations require authentication
- Anonymous users can only read public data
- Admin operations require specific roles

### Input Validation

- All text inputs are validated for length and content
- Principal IDs are verified
- Numeric inputs are checked for valid ranges

### Rate Limiting

- Quiz submissions are rate-limited per user
- Token rewards have daily limits
- Course creation has cooldown periods

## 📊 Performance Tips

### Batch Operations

```motoko
// Instead of multiple single calls
let courses = await Promise.all([
  actors.courses.getCourseById(1),
  actors.courses.getCourseById(2),
  actors.courses.getCourseById(3),
]);

// Use batch query when available
let courses = await actors.courses.getCoursesByIds([1, 2, 3]);
```

### Caching

```typescript
// Cache frequently accessed data
const courseCache = new Map<number, Course>();

const getCourse = async (id: number) => {
  if (courseCache.has(id)) {
    return courseCache.get(id);
  }

  const course = await actors.courses.getCourseById(id);
  courseCache.set(id, course);
  return course;
};
```

## 🐛 Common Issues

### "Call rejected" errors

- Check authentication status
- Verify canister is deployed
- Ensure user has required permissions

### "Out of cycles" errors

- Top up canister cycles
- Optimize query vs update calls
- Use query methods when possible

### Type mismatches

- Verify IDL definitions are up to date
- Check parameter formatting
- Ensure proper variant syntax

---

## 📚 Additional Resources

- [Internet Computer Documentation](https://internetcomputer.org/docs/)
- [Motoko Language Guide](https://internetcomputer.org/docs/current/motoko/main/getting-started/)
- [Candid Interface Description Language](https://internetcomputer.org/docs/current/references/candid-ref/)
- [DFX Command Reference](https://internetcomputer.org/docs/current/references/cli-reference/)

For more specific integration examples and advanced usage patterns, check the `/examples` directory in the repository.
