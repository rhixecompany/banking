---
name: shell
description: >-
  Execute shell commands directly. Use when the user explicitly invokes /shell and wants the following text executed directly in the terminal.
metadata:
  surfaces:
    - cli
    - ide
    - chat
---

# Shell Command Execution

Execute shell commands directly in the terminal. This skill provides comprehensive guidance for running commands safely and effectively across all AI agent platforms (OpenCode, Cursor, GitHub Copilot).

## When to Use This Skill

- User explicitly invokes `/shell` command
- Direct terminal execution is required
- Running build scripts, tests, or CLI tools
- Executing git commands
- Running package manager commands

## Platform-Specific Considerations

### OpenCode

In OpenCode, use the native `bash` tool:
- Execute commands via `bash` tool
- Commands run in persistent shell session
- Can chain commands with `&&` or `;`
- Use `workdir` parameter for directory-specific commands

### Cursor

In Cursor IDE:
- Use integrated terminal
- Leverage Cmd/Ctrl+` for quick terminal access
- Can use terminal in chat context

### GitHub Copilot

In Copilot CLI or VS Code:
- Use VS Code's integrated terminal
- Leverage terminal commands in chat
- Use `!` prefix for shell commands

## 1. Safe Command Execution

Follow these rules for safe shell execution:

### Hard Rules

- **Never execute destructive commands without explicit approval**
- **Never use `rm -rf` without checking paths first**
- **Never run commands that modify git history without approval**
- **Always verify paths before deletion**

### Safe Command Patterns

```bash
# ✅ Safe - Specific file deletion
rm path/to/specific/file.txt

# ❌ Unsafe - Recursive deletion
rm -rf path/

# ✅ Safe - Check before delete
ls path/ && rm -r path/
```

### OpenCode Safe Patterns

```typescript
// Safe: Check before executing
bash({ command: "ls -la path/", description: "List directory contents" })
bash({ command: "rm -f specific-file.txt", description: "Remove specific file" })

// Unsafe without approval - will prompt
bash({ command: "rm -rf node_modules/", description: "Remove node_modules" })
```

## 2. Command Chaining

Chain commands for complex operations:

### Sequential Execution

```bash
# Run commands in sequence
cd /project && npm install && npm run build

# Run and continue on failure
cd /project; npm install
```

### Conditional Execution

```bash
# Run second command only if first succeeds
npm install && npm run test

# Run second command only if first fails
npm install || echo "Install failed"
```

### Parallel Execution

```bash
# Run commands in background
npm run dev &
npm run build &

# Wait for background jobs
wait
```

## 3. Working with Directories

### Directory Navigation

```bash
# Change directory
cd /path/to/directory

# Go to home directory
cd ~

# Go to previous directory
cd -

# Go to project root
cd $(git rev-parse --show-toplevel)
```

### Directory Operations

```bash
# List files
ls -la                    # Detailed list
ls -lh                    # Human-readable sizes
ls -t                     # Sort by time
ls -r                     # Reverse order

# Create directory
mkdir -p path/to/directory    # Create parent dirs as needed

# Remove directory
rmdir empty-directory         # Remove empty dir
rm -rf directory              # Remove directory and contents
```

### OpenCode Directory Commands

```typescript
// Use workdir parameter instead of cd
bash({ command: "npm install", workdir: "/project", description: "Install dependencies" })

// Or use absolute paths
bash({ command: "ls -la /project/src", description: "List project source" })
```

## 4. File Operations

### File Viewing

```bash
# View file contents
cat file.txt                    # Show entire file
head -20 file.txt               # First 20 lines
tail -20 file.txt               # Last 20 lines
nl file.txt                     # Numbered lines

# Search in file
grep "pattern" file.txt         # Show matching lines
grep -n "pattern" file.txt      # Show with line numbers
grep -v "pattern" file.txt      # Show non-matching lines
```

### File Creation and Editing

```bash
# Create file
echo "content" > file.txt           # Overwrite file
echo "content" >> file.txt          # Append to file

# Copy file
cp source.txt destination.txt
cp -r source/ destination/          # Copy directory

# Move/rename file
mv old-name.txt new-name.txt
```

### File Deletion

```bash
# Remove file
rm file.txt                         # Remove single file
rm -f file.txt                      # Force remove
rm -i file.txt                      # Interactive (confirm)
```

## 5. Text Processing

### Search and Replace

```bash
# Find files
find . -name "*.ts"                 # Find TypeScript files
find . -type f -mtime -1            # Files modified today

# Search in files
grep -r "pattern" .                 # Recursive search
grep -l "pattern" *.txt             # Files containing pattern
```

### Text Manipulation

```bash
# Sort lines
sort file.txt                      # Sort alphabetically
sort -u file.txt                   # Sort and remove duplicates

# Count lines
wc -l file.txt                     # Count lines
wc -w file.txt                     # Count words

# Unique lines
uniq file.txt                      # Remove adjacent duplicates
```

## 6. Package Manager Commands

### npm/yarn/pnpm

```bash
# Install dependencies
npm install                        # Install all dependencies
npm install package-name           # Install specific package
npm install -D package-name        # Install as dev dependency

# Run scripts
npm run dev                        # Start dev server
npm run build                      # Build for production
npm run test                       # Run tests

# Clean and rebuild
rm -rf node_modules && npm install
```

### bun (if using Bun)

```bash
# Install dependencies
bun install                        # Install all dependencies
bun add package-name               # Add package
bun add -d package-name            # Add as dev dependency

# Run scripts
bun run dev                        # Start dev server
bun run build                      # Build
bun run test                       # Run tests
```

## 7. Git Commands

### Basic Git Operations

```bash
# Check status
git status                        # Show working tree status
git status -s                     # Short format

# Stage changes
git add file.txt                  # Stage specific file
git add .                         # Stage all changes
git add -p                        # Stage hunks interactively

# Commit changes
git commit -m "message"           # Commit with message
git commit --amend                # Amend last commit

# View history
git log --oneline -10             # Last 10 commits
git diff main...HEAD               # Changes since main
```

### Branch Operations

```bash
# Create and switch branch
git checkout -b feature-branch

# Switch branches
git checkout main

# Merge branch
git merge feature-branch

# Delete branch
git branch -d feature-branch       # Delete local branch
git push origin --delete branch    # Delete remote branch
```

### Remote Operations

```bash
# Push changes
git push origin main
git push -u origin feature-branch  # Push and set upstream

# Pull changes
git pull origin main
git pull --rebase origin main      # Rebase on pull

# Fetch updates
git fetch origin
```

## 8. Process Management

### Running Processes

```bash
# Run in background
npm run dev &

# List processes
ps aux | grep node                # Find node processes
pgrep -f "node"                   # Find node PIDs

# Kill processes
kill PID                          # Graceful kill
kill -9 PID                       # Force kill

# Background job control
jobs                              # List background jobs
fg                                # Bring to foreground
Ctrl+Z                            # Suspend current job
bg                                # Resume in background
```

### Port Management

```bash
# Find process on port
lsof -i :3000                     # macOS/Linux
netstat -ano | findstr :3000      # Windows

# Kill process on port
kill $(lsof -t -i:3000)           # Kill by port
```

## 9. Environment Variables

### Viewing Variables

```bash
# List all env vars
env

# View specific variable
echo $PATH
echo $HOME

# View multiple
env | grep NODE
```

### Setting Variables

```bash
# Temporary (current session)
export NODE_ENV=development

# Permanent (add to ~/.bashrc or ~/.zshrc)
echo 'export NODE_ENV=development' >> ~/.bashrc

# For single command
NODE_ENV=production npm run build
```

## 10. Error Handling

### Check Command Success

```bash
# Check exit code
command && echo "Success" || echo "Failed"

# Capture exit code
command; echo $?

# Exit on error
set -e
command_that_can_fail
```

### Debug Output

```bash
# Verbose output
npm install --verbose

# Show commands being run
set -x
command

# Redirect stderr
command 2> errors.log
command > output.log 2>&1
```

## 11. Common Patterns

### Project Setup

```bash
# Clone and setup
git clone repo-url && cd repo-name && npm install

# Create new project
npx create-next-app@latest my-app
cd my-app && npm install
```

### Development Workflow

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

### Build and Deploy

```bash
# Build
npm run build

# Preview build
npm run start

# Deploy (example)
npm run build && npm run start
```

## 12. Security Considerations

### Dangerous Commands to Avoid

```bash
# NEVER run these without explicit approval:
rm -rf /                          # Delete root
rm -rf .git                       # Delete git history
git reset --hard                  # Discard all changes
dd if=/dev/zero of=/dev/sda       # Write to disk
curl | sudo sh                    # Pipe to sudo
```

### Safe Alternatives

```bash
# Instead of rm -rf, use:
rm -ri directory/                 # Interactive, asks for each file

# Instead of git reset --hard, use:
git stash                         # Save changes safely

# Instead of destructive commands:
git checkout -- file              # Restore file
```

## 13. Platform-Specific Commands

### Windows (PowerShell)

```powershell
# List files
Get-ChildItem

# Find process
Get-Process -Name node

# Kill process
Stop-Process -Id PID

# Environment variables
$env:NODE_ENV = "development"
```

### macOS

```bash
# Open in Finder
open .

# Show hidden files
defaults write com.apple.finder AppleShowAllFiles true
killall Finder
```

### Linux

```bash
# System info
uname -a
df -h
free -h
```

## Troubleshooting

### Issue: Command not found

**Solution:**
1. Check PATH: `echo $PATH`
2. Use full path: `/usr/local/bin/command`
3. Install missing package

### Issue: Permission denied

**Solution:**
1. Check file permissions: `ls -la file`
2. Use sudo for system files: `sudo command`
3. Fix permissions: `chmod +x script.sh`

### Issue: Command hangs

**Solution:**
1. Press Ctrl+C to cancel
2. Check if process is running: `ps aux | grep command`
3. Kill if needed: `kill PID`

### Issue: Working directory not found

**Solution:**
1. Use absolute paths
2. Check directory exists: `ls -la /path`
3. Use workdir parameter in OpenCode

## Best Practices

1. **Always use absolute paths** in OpenCode
2. **Check before destructive operations** - list files first
3. **Use `--` to separate options from arguments**
4. **Quote paths with spaces**: `"path with spaces"/file.txt`
5. **Use `set -e` for scripts** that should fail on error
6. **Redirect output** for long-running commands
7. **Check exit codes** for critical operations

## Related Skills

- `git-commit` - For git workflow
- `testing-skill` - For running tests
- `code-review` - For code inspection

## Notes

- Always verify paths before execution
- Get explicit approval for destructive commands
- Use `workdir` parameter in OpenCode instead of `cd`
- Chain commands with `&&` for safe sequential execution