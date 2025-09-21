# 🤝 Contributing to KnowFi

Thank you for your interest in contributing to KnowFi! This document provides guidelines for contributing to the project and helps ensure a smooth collaboration process.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Coding Standards](#-coding-standards)
- [Pull Request Process](#-pull-request-process)
- [Issue Guidelines](#-issue-guidelines)
- [Community Guidelines](#-community-guidelines)

## 🌟 Code of Conduct

KnowFi is committed to providing a welcoming and inclusive environment for all contributors. Please read and follow our Code of Conduct:

- **Be respectful**: Treat all community members with respect and courtesy
- **Be inclusive**: Welcome newcomers and help them get started
- **Be collaborative**: Work together to solve problems and share knowledge
- **Be constructive**: Provide helpful feedback and suggestions
- **Be patient**: Remember that everyone is learning and growing

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Set up the development environment** following our [Setup Guide](./SETUP.md)
2. **Familiarized yourself** with the [API Documentation](./API.md)
3. **Read the project README** to understand KnowFi's goals and architecture

### Types of Contributions

We welcome various types of contributions:

- **🐛 Bug fixes**: Help us identify and fix issues
- **✨ New features**: Implement new functionality
- **📚 Documentation**: Improve or add documentation
- **🎨 UI/UX improvements**: Enhance the user experience
- **🧪 Tests**: Add or improve test coverage
- **🔧 Performance**: Optimize code and improve performance
- **🌐 Translations**: Help make KnowFi accessible to more users

## 🔄 Development Workflow

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/know_fi.git
cd know_fi

# Add upstream remote
git remote add upstream https://github.com/crtzn/know_fi.git
```

### 2. Create a Feature Branch

```bash
# Fetch latest changes
git fetch upstream
git checkout main
git merge upstream/main

# Create a new branch for your feature
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 3. Set Up Development Environment

```bash
# Install dependencies
yarn install

# Start local development
dfx start --clean --background
dfx deploy

# Start frontend
cd src/know_fi_frontend
yarn dev
```

### 4. Make Your Changes

Follow our [coding standards](#-coding-standards) while making changes.

### 5. Test Your Changes

```bash
# Run frontend tests
cd src/know_fi_frontend
yarn test

# Test canister functionality
dfx canister call courses getCourses

# Lint your code
yarn lint
```

### 6. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add course progress tracking

- Add progress tracking to course completion
- Update UI to show completion percentage
- Add backend support for progress storage

Closes #123"
```

### 7. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

## 📝 Coding Standards

### General Principles

- **Clarity over cleverness**: Write code that is easy to read and understand
- **Consistency**: Follow existing patterns and conventions
- **Documentation**: Document complex logic and public APIs
- **Testing**: Write tests for new functionality
- **Performance**: Consider performance implications of your changes

### Frontend (TypeScript/React)

#### File Organization
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── features/     # Feature-specific components
│   └── layout/       # Layout components
├── hooks/            # Custom React hooks
├── contexts/         # React contexts
├── services/         # API services
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

#### Naming Conventions
```typescript
// Components: PascalCase
export function CourseCard() { ... }

// Hooks: camelCase starting with 'use'
export function useAuth() { ... }

// Types: PascalCase
interface UserProfile { ... }

// Constants: SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';

// Variables/functions: camelCase
const userName = 'john_doe';
function getUserProfile() { ... }
```

#### Code Style
```typescript
// Use TypeScript strictly
interface CourseProps {
  id: number;
  title: string;
  onComplete?: () => void;
}

// Use functional components with hooks
export function CourseCard({ id, title, onComplete }: CourseProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleComplete = useCallback(async () => {
    setIsLoading(true);
    try {
      await completeCourse(id);
      onComplete?.();
    } catch (error) {
      console.error('Failed to complete course:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id, onComplete]);

  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <Button onClick={handleComplete} disabled={isLoading}>
        {isLoading ? 'Completing...' : 'Complete Course'}
      </Button>
    </Card>
  );
}
```

#### Error Handling
```typescript
// Use try-catch for async operations
try {
  const result = await api.createCourse(courseData);
  return result;
} catch (error) {
  console.error('Failed to create course:', error);
  throw new Error('Course creation failed');
}

// Use error boundaries for component errors
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  // ... error boundary implementation
}
```

### Backend (Motoko)

#### File Organization
```
src/know_fi_backend/
├── auth/
│   └── main.mo
├── courses/
│   ├── main.mo
│   └── types/
│       └── course_types.mo
├── profile/
│   ├── src/
│   │   └── main.mo
│   ├── module/
│   └── types/
└── shared/          # Shared utilities and types
```

#### Naming Conventions
```motoko
// Types: PascalCase
type UserProfile = {
  id: Principal;
  username: Text;
  email: ?Text;
};

// Functions: camelCase
public func createUser(profile: UserProfile) : async Result<(), Text> {
  // implementation
}

// Variables: camelCase
let userProfile = getUserProfile(userId);

// Constants: SCREAMING_SNAKE_CASE
let MAX_COURSE_DURATION = 480; // minutes
```

#### Code Style
```motoko
// Use Result types for error handling
public func createCourse(submission: CourseSubmission) : async Result<Nat, Text> {
  // Validate input
  if (submission.title.size() == 0) {
    return #err("Course title cannot be empty");
  };
  
  // Verify authentication
  if (Principal.isAnonymous(caller)) {
    return #err("Authentication required");
  };
  
  // Create course
  let courseId = nextCourseId;
  let newCourse: Course = {
    id = courseId;
    title = submission.title;
    // ... other fields
  };
  
  // Store course
  courses.put(courseId, newCourse);
  nextCourseId += 1;
  
  #ok(courseId)
};

// Use proper error handling
switch (courses.get(courseId)) {
  case (?course) {
    // Course found
    course
  };
  case null {
    // Course not found
    return #err("Course not found");
  };
}
```

#### Security Best Practices
```motoko
// Always verify caller authentication
public shared({caller}) func sensitiveOperation() : async Result<(), Text> {
  if (Principal.isAnonymous(caller)) {
    return #err("Authentication required");
  };
  
  // Check authorization
  switch (await auth.hasRole(caller, #admin)) {
    case true {
      // Proceed with operation
    };
    case false {
      return #err("Insufficient permissions");
    };
  };
}

// Validate input parameters
public func updateProfile(profile: UserProfile) : async Result<(), Text> {
  // Validate username length
  if (profile.username.size() < 3 or profile.username.size() > 20) {
    return #err("Username must be between 3 and 20 characters");
  };
  
  // Validate email format (if provided)
  switch (profile.email) {
    case (?email) {
      if (not Text.contains(email, #char '@')) {
        return #err("Invalid email format");
      };
    };
    case null { /* no email provided */ };
  };
  
  // Update profile
  // ...
}
```

### Database/Storage Patterns

```motoko
// Use stable storage for persistence
stable var coursesStable: [(Nat, Course)] = [];

// Use HashMap for runtime operations
private var courses = HashMap.HashMap<Nat, Course>(0, Nat.equal, Nat32.fromNat);

// Implement upgrade hooks
system func preupgrade() {
  coursesStable := Iter.toArray(courses.entries());
};

system func postupgrade() {
  courses := HashMap.fromIter(coursesStable.vals(), coursesStable.size(), Nat.equal, Nat32.fromNat);
  coursesStable := [];
};
```

## 🔍 Pull Request Process

### Before Submitting

1. **Ensure your code follows our coding standards**
2. **Write/update tests for your changes**
3. **Update documentation if necessary**
4. **Test your changes thoroughly**
5. **Rebase your branch on the latest main**

```bash
git fetch upstream
git rebase upstream/main
```

### Pull Request Template

When creating a pull request, include:

```markdown
## Description
Brief description of changes made

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Frontend tests pass
- [ ] Canister tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

### Review Process

1. **Automated checks** will run on your PR
2. **Community review** from other contributors
3. **Maintainer review** for final approval
4. **Merge** once all checks pass and reviews are positive

## 🐛 Issue Guidelines

### Reporting Bugs

Use our bug report template:

```markdown
**Bug Description**
A clear and concise description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- DFX Version: [e.g. 0.15.0]
- Node.js Version: [e.g. 18.0.0]

**Additional Context**
Add any other context about the problem here.
```

### Feature Requests

Use our feature request template:

```markdown
**Feature Description**
A clear and concise description of what you want to happen.

**Use Case**
Describe the problem you're trying to solve.

**Proposed Solution**
Describe the solution you'd like.

**Alternatives Considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional Context**
Add any other context or screenshots about the feature request here.
```

## 🏷️ Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

### Examples
```
feat(courses): add course progress tracking

fix(auth): resolve login redirect issue

docs(api): update course creation documentation

style(frontend): improve button component styling

refactor(backend): optimize course query performance
```

## 🧪 Testing Guidelines

### Frontend Testing

```typescript
// Component tests using React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { CourseCard } from './CourseCard';

describe('CourseCard', () => {
  it('renders course title correctly', () => {
    render(<CourseCard title="Test Course" id={1} />);
    expect(screen.getByText('Test Course')).toBeInTheDocument();
  });

  it('calls onComplete when button is clicked', () => {
    const onComplete = jest.fn();
    render(<CourseCard title="Test Course" id={1} onComplete={onComplete} />);
    
    fireEvent.click(screen.getByText('Complete Course'));
    expect(onComplete).toHaveBeenCalled();
  });
});
```

### Backend Testing

```bash
# Test canister methods directly
dfx canister call courses createCourse '(...)'
dfx canister call courses getCourses

# Automated testing with scripts
./scripts/test-canisters.sh
```

## 🌐 Community Guidelines

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and community discussions
- **Discord/Telegram**: Real-time chat and support (links in README)

### Getting Help

1. **Check existing documentation** first
2. **Search existing issues** for similar problems
3. **Ask in community channels** for general questions
4. **Create detailed issues** for bugs or feature requests

### Code Review Guidelines

When reviewing pull requests:

- **Be constructive** and provide specific feedback
- **Explain the 'why'** behind your suggestions
- **Acknowledge good work** and improvements
- **Test the changes** when possible
- **Be responsive** to questions and discussions

## 🎯 Areas for Contribution

We particularly welcome contributions in these areas:

### High Priority
- **📱 Mobile responsiveness** improvements
- **♿ Accessibility** enhancements
- **🔧 Performance** optimizations
- **🧪 Test coverage** expansion
- **🌐 Internationalization** support

### Medium Priority
- **🎨 UI/UX** improvements
- **📚 Documentation** expansion
- **🔌 API** enhancements
- **🛡️ Security** improvements

### Low Priority
- **🎮 Gamification** features
- **📊 Analytics** dashboard
- **🎯 Advanced features**

## 🏆 Recognition

Contributors will be recognized in the following ways:

- **🎖️ Contributor list** in README
- **🏅 Special badges** for significant contributions
- **📢 Social media** recognition
- **🎁 Potential rewards** from the KnowFi ecosystem

## ❓ Questions?

If you have any questions about contributing, please:

1. Check our [FAQ](./FAQ.md)
2. Search existing GitHub issues
3. Create a new issue with the "question" label
4. Join our community discussions

Thank you for contributing to KnowFi! Together, we're building the future of decentralized education. 🦉📚✨