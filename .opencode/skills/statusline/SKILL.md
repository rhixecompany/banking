---
name: statusline
description: >-
  Configure a custom status line in the CLI. Use when the user mentions status line, statusline, statusLine, CLI status bar, prompt footer customization, or wants to add session context above the prompt.


metadata:
  surfaces:
    - cli
    - ide
---

# Status Line Configuration

Configure custom status lines for CLI and IDE environments. This comprehensive skill covers status line customization, session context display, and best practices across all AI agent platforms (OpenCode, Cursor, GitHub Copilot).

## When to Use This Skill

- Customizing CLI prompt with session context
- Adding project information to status bar
- Displaying git branch and status
- Showing current task or mode
- Adding custom information to prompt footer

## Platform-Specific Considerations

### OpenCode

In OpenCode:

- Configure via `~/.opencode/config.json`
- Use environment variables for dynamic content
- Support for prompt customization
- Session context integration

### Cursor

In Cursor IDE:

- Use `.cursorrules` for status customization
- Configure via Settings > Terminal
- Support for Powerline-style prompts
- Status bar integration

### GitHub Copilot

In Copilot CLI or VS Code:

- Customize terminal prompt
- Use Oh My Zsh themes
- Configure Powerline
- Status bar via VS Code settings

## 1. Basic Status Line Configuration

### Simple Status Line

```bash
# Basic prompt with user and directory
PS1="\u@\h:\w\$ "

# Add time
PS1="\u@\h:\w [\t]\$ "

# Add git branch
PS1="\u@\h:\w \$(git branch --show-current)\$ "
```

### Environment Variables

```bash
# Set custom prompt
export PS1="[\u@\h] \w \$ "

# Add context variables
export STATUS_CONTEXT="project-name"
export STATUS_MODE="development"
```

## 2. Advanced Status Line Elements

### Git Information

```bash
# Git branch and status
parse_git_branch() {
  git branch 2>/dev/null | grep '*' | sed 's/* //'
}

parse_git_status() {
  local status=$(git status --short 2>/dev/null)
  if [ -n "$status" ]; then
    echo " ($(echo "$status" | wc -l))"
  fi
}

PS1="\$(parse_git_branch)\$(parse_git_status) $ "
```

### Project Context

```bash
# Show project name
get_project_name() {
  if [ -f "package.json" ]; then
    cat package.json | grep '"name"' | cut -d'"' -f4
  elif [ -f "Cargo.toml" ]; then
    grep "^name" Cargo.toml | cut -d'=' -f2 | tr -d ' '
  fi
}

PS1="$(get_project_name) $ "
```

### Session Information

```bash
# Show session info
get_session_info() {
  echo "[session:${SESSION_ID}]"
}

PS1="\$(get_session_info) \w $ "
```

### Mode Indicators

```bash
# Show current mode (read, write, debug)
get_mode_indicator() {
  case $MODE in
    read) echo "📖 " ;;
    write) echo "✏️ " ;;
    debug) echo "🐛 " ;;
    *) echo "" ;;
  esac
}

PS1="\$(get_mode_indicator)\h:\w\$ "
```

## 3. Powerline Style Status Line

### Powerline Installation

```bash
# Install Powerline fonts
git clone https://github.com/powerline/fonts.git
cd fonts
./install.sh

# Or use pre-patched fonts
# Download from: https://github.com/powerline/fonts
```

### Powerline Theme

```bash
# Basic Powerline prompt
export PS1="\[\e[32m\]\u@\h\[\e[0m\]:\[\e[34m\]\w\[\e[0m\]\$(git_branch)\$ "

# Full Powerline with segments
powerline_segments() {
  local segment=""

  # User and host
  segment+="\[\e[32m\]\u@\h\[\e[0m\]"

  # Working directory
  segment+=":\[\e[34m\]\w\[\e[0m\]"

  # Git branch
  segment+="\$(parse_git_branch)"

  # Return prompt
  echo "$segment\$ "
}

PS1="$(powerline_segments)"
```

### Color Scheme

| Element    | Color Code  | Description         |
| ---------- | ----------- | ------------------- |
| User       | 32 (green)  | Current user        |
| Host       | 32 (green)  | Hostname            |
| Path       | 34 (blue)   | Working directory   |
| Git branch | 33 (yellow) | Current branch      |
| Git status | 31 (red)    | Uncommitted changes |
| Error      | 31 (red)    | Last command failed |

## 4. Platform-Specific Configuration

### OpenCode Configuration

```json
// ~/.opencode/config.json
{
  "statusline": {
    "enabled": true,
    "template": "[{session}] {project} {git_branch} {mode}",
    "elements": {
      "session": {
        "enabled": true,
        "format": "sess-{id}"
      },
      "project": {
        "enabled": true,
        "source": "package.json"
      },
      "git_branch": {
        "enabled": true,
        "show_status": true
      },
      "mode": {
        "enabled": true,
        "indicators": {
          "read": "R",
          "write": "W",
          "debug": "D"
        }
      }
    }
  }
}
```

### Cursor Configuration

```json
// .cursorrules - Terminal section
{
  "terminal": {
    "prompt": "➜ {project} {git_branch}",
    "colors": {
      "user": "green",
      "path": "blue",
      "git": "yellow"
    }
  }
}
```

### Custom Prompt Scripts

```bash
# ~/.bashrc - Custom prompt
export STATUSLINE_THEME="modern"

statusline() {
  local branch=$(git branch --show-current 2>/dev/null)
  local status=$(git status --short 2>/dev/null | wc -l)
  local project=$(basename $(pwd))

  echo "[$project] $branch$([ $status -gt 0 ] && echo " +$status")"
}

PS1="\$(statusline) $ "
```

## 5. Dynamic Status Information

### Context-Based Display

```bash
# Show different info based on directory
get_context_prompt() {
  case $(pwd) in
    */src) echo "📁 src " ;;
    */tests) echo "🧪 tests " ;;
    */docs) echo "📝 docs " ;;
    *) echo "" ;;
  esac
}
```

### Time-Based Information

```bash
# Show time or context based on time
get_time_prompt() {
  local hour=$(date +%H)
  if [ $hour -lt 12 ]; then
    echo "☀️ "
  elif [ $hour -lt 18 ]; then
    echo "🌤️ "
  else
    echo "🌙 "
  fi
}
```

### Conditional Elements

```bash
# Show elements conditionally
get_conditional_status() {
  local parts=()

  # Always show user
  parts+=("\u")

  # Show git only in git repos
  if git rev-parse --git-dir >/dev/null 2>&1; then
    parts+=("$(git branch --show-current)")
  fi

  # Show mode if set
  if [ -n "$MODE" ]; then
    parts+=("[$MODE]")
  fi

  echo "${parts[*]}"
}
```

## 6. Status Line Components

### Component: Git Status

```bash
# Git status component
git_status_component() {
  local branch=$(git branch --show-current 2>/dev/null)
  local status=$(git status --short 2>/dev/null)

  if [ -z "$branch" ]; then
    return
  fi

  local output="$branch"

  # Count changes
  local modified=$(echo "$status" | grep "^.M" | wc -l)
  local added=$(echo "$status" | grep "^??" | wc -l)

  [ $modified -gt 0 ] && output+=" +$modified"
  [ $added -gt 0 ] && output+=" ?$added"

  echo "$output"
}
```

### Component: Virtual Environment

```bash
# Python virtual environment
venv_component() {
  if [ -n "$VIRTUAL_ENV" ]; then
    echo "($(basename $VIRTUAL_ENV))"
  fi
}
```

### Component: Kubernetes Context

```bash
# Kubernetes context
k8s_component() {
  if command -v kubectl >/dev/null 2>&1; then
    local context=$(kubectl config current-context 2>/dev/null)
    if [ -n "$context" ]; then
      echo "k8s:$context"
    fi
  fi
}
```

### Component: Docker Status

```bash
# Docker status
docker_component() {
  if command -v docker >/dev/null 2>&1; then
    local containers=$(docker ps --format "{{.Names}}" 2>/dev/null | wc -l)
    if [ $containers -gt 0 ]; then
      echo "docker:$containers"
    fi
  fi
}
```

## 7. Theme Examples

### Minimal Theme

```bash
# Minimal - just essentials
export PS1="\u:\W\$ "
```

### Developer Theme

```bash
# Developer - shows git and mode
export PS1="\u@\h \$(git branch --show-current 2>/dev/null) \W\$ "
```

### Information-Rich Theme

```bash
# Information-rich
export PS1='\[\e[1;32m\]\u@\h\[\e[0m\]:\[\e[1;34m\]\w\[\e[0m\]$(git_branch)$(venv_status)\$ '
```

### Powerline Theme

```bash
# Powerline-style
PS1="%F{green}%n%f:%F{blue}%~%f$(git_prompt_info)%(?.%F{yellow}.%F{red})%#%f "
```

## 8. Integration with AI Agents

### Session Context Display

```bash
# Display current agent context
export AGENT_CONTEXT="coding"
export AGENT_TASK="refactoring"

get_agent_status() {
  echo "[$AGENT_CONTEXT:$AGENT_TASK]"
}

PS1="\$(get_agent_status) \w \$ "
```

### Task Tracking

```bash
# Show current task
export CURRENT_TASK="implement-auth"

get_task_status() {
  if [ -n "$CURRENT_TASK" ]; then
    echo "task:$CURRENT_TASK"
  fi
}
```

### Mode Indicators

```bash
# Show agent mode
export AGENT_MODE="read"  # read, write, debug, test

get_mode_prompt() {
  case $AGENT_MODE in
    read) echo "📖" ;;
    write) echo "✏️" ;;
    debug) echo "🐛" ;;
    test) echo "🧪" ;;
    *) echo "•" ;;
  esac
}
```

## 9. Testing and Debugging

### Test Status Line

```bash
# Test prompt rendering
echo $PS1

# Show expanded prompt
echo "$PS1" | sed 's/\\\[//g; s/\\\]//g'

# Debug prompt expansion
set -x
ls
set +x
```

### Debug Functions

```bash
# Debug status line functions
debug_statusline() {
  echo "=== Status Line Debug ==="
  echo "PS1: $PS1"
  echo "USER: $USER"
  echo "PWD: $PWD"
  echo "GIT_BRANCH: $(git branch --show-current 2>/dev/null)"
}

# Run debug
debug_statusline
```

## 10. Best Practices

### Do

- Keep status line readable and not too long
- Use colors for visual hierarchy
- Include essential information only
- Test in different terminal emulators
- Consider accessibility (color blindness)

### Don't

- Don't make it too complex
- Don't include sensitive information
- Don't use too many colors
- Don't slow down prompt rendering

### Performance

```bash
# Cache expensive operations
cache_git_status() {
  local cache_file="/tmp/git-status-cache"
  local cache_age=5  # seconds

  if [ -f "$cache_file" ] && [ $(($(date +%s) - $(stat -c %Y "$cache_file"))) -lt $cache_age ]; then
    cat "$cache_file"
    return
  fi

  local status=$(git status --short 2>/dev/null)
  echo "$status" > "$cache_file"
  echo "$status"
}
```

## 11. Troubleshooting

### Issue: Prompt not displaying correctly

**Solution:**

1. Check terminal supports ANSI codes
2. Verify escape sequences are properly wrapped
3. Test with simple prompt first

### Issue: Slow prompt rendering

**Solution:**

1. Cache expensive commands
2. Use async/prompt delay
3. Simplify git status checks

### Issue: Colors not showing

**Solution:**

1. Check terminal supports 256 colors
2. Use correct color codes
3. Verify TERM setting

### Issue: Git branch not showing

**Solution:**

1. Check git is installed
2. Verify in git repository
3. Check git command works manually

## 12. Cross-Platform Reference

| Platform   | Config Location           | Format     |
| ---------- | ------------------------- | ---------- |
| OpenCode   | `~/.opencode/config.json` | JSON       |
| Cursor     | `.cursorrules`            | JSON       |
| Bash       | `~/.bashrc`               | Shell      |
| Zsh        | `~/.zshrc`                | Shell      |
| PowerShell | `$PROFILE`                | PowerShell |

## Related Skills

- `shell` - For shell command execution
- `git-commit` - For git workflow
- `update-cli-config` - For CLI configuration

## Notes

- Test status line in multiple environments
- Keep it simple and informative
- Use caching for performance
- Update based on workflow needs

---

## Multi-Agent Status Line Workflows

### Agent Context Display

When running multiple AI agents, configure status line to show current agent context:

```bash
# Display current agent and task
export AGENT_NAME="build"
export AGENT_TASK="implement-auth"

get_agent_status() {
  echo "[$AGENT_NAME:$AGENT_TASK]"
}

PS1="\$(get_agent_status) \w \$ "
```

### Parallel Agent Status Tracking

For parallel agent execution, track multiple contexts:

```bash
# Track multiple agent contexts
export AGENT_1="explore"
export AGENT_2="build"
export AGENT_3="test"

get_parallel_status() {
  echo "[$AGENT_1|$AGENT_2|$AGENT_3]"
}

PS1="\$(get_parallel_status) \h:\w\$ "
```

### Session-Based Status Line

For agentic workflows with session tracking:

```bash
# Show session and branch info
export SESSION_ID="dev-001"
export CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)

get_session_status() {
  echo "[$SESSION_ID:$CURRENT_BRANCH]"
}

PS1="\$(get_session_status) \u@\h:\w\$ "
```

### Task-Specific Prompts

Configure different prompts based on current task:

```bash
# Different prompts for different tasks
case $AGENT_TASK in
  explore) PS1="🔍 \w \$ " ;;
  build)   PS1="🔨 \w \$ " ;;
  test)    PS1="🧪 \w \$ " ;;
  review)  PS1="👀 \w \$ " ;;
  *)       PS1="\w \$ " ;;
esac
```

---

## Cross-References

### Related Skills

- **shell** - For shell command execution and prompt customization
- **git-commit** - For git workflow and branch display in status line
- **update-cli-config** - For CLI configuration management
- **update-cursor-settings** - For IDE-specific status customization

### Reference Files

- `~/.bashrc` - Bash prompt configuration
- `~/.zshrc` - Zsh prompt configuration
- `~/.opencode/config.json` - OpenCode status line configuration
- `.cursorrules` - Cursor IDE terminal configuration

### Related Concepts

- Powerline fonts and themes
- ANSI color codes for terminal customization
- Git prompt helpers
- Environment variable-based context display

---

## Best Practices (Enhanced)

### Configuration Management

1. **Version control your prompt** - Keep prompt configurations in dotfiles repo
2. **Use modular functions** - Break complex prompts into reusable functions
3. **Cache expensive operations** - Git status, branch detection can be slow
4. **Test across terminals** - Different terminals render differently
5. **Document your setup** - Future you will thank present you

### Performance Optimization

1. **Lazy evaluation** - Only compute what's needed when needed
2. **Async prompts** - Use background processes for slow commands
3. **Caching** - Cache git status, branch info with TTL
4. **Minimal commands** - Keep prompt computation under 100ms

### Accessibility Considerations

1. **High contrast modes** - Ensure visibility in light/dark themes
2. **Color blindness** - Don't rely solely on color for meaning
3. **Screen readers** - Some terminals announce prompt changes
4. **Reduced motion** - Avoid excessive animation in prompt

### Security Best Practices

1. **No sensitive data** - Never display passwords, keys, or secrets
2. **Sanitize output** - Escape special characters in dynamic content
3. **Limit information** - Don't expose internal system paths
4. **Environment isolation** - Use separate configs for work/personal

### Maintenance Tips

1. **Iterative improvement** - Add features one at a time
2. **Version backup** - Keep working versions before changes
3. **Modular segments** - Easy to add/remove components
4. **Document changes** - Comment complex prompt logic

### Anti-Patterns to Avoid

- **Overly complex prompts** - Hard to debug and maintain
- **Slow git operations** - Blocks prompt rendering
- **Too much information** - Clutters the terminal
- **No fallback** - Breaks when commands fail
- **Hardcoded values** - Not portable across machines
