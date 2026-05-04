---
name: asdf
description: Use this skill whenever the user wants to install, configure, or use asdf (asdf-vm), the universal version manager. Trigger for any mention of asdf, .tool-versions files, managing runtime versions, switching between versions of Node.js, Python, Ruby, Go, Terraform, kubectl, Java, Erlang, Elixir, or any other tool managed by asdf. Also trigger when migrating from nvm, pyenv, rbenv, goenv, tfenv, or similar single-language version managers. Use this skill for help with asdf plugins, asdf install, asdf set/global/local, troubleshooting shims, Fish/Bash/Zsh shell configuration, and multi-project version isolation workflows.
license: MIT
compatibility: opencode
---

# asdf Version Manager Skill

---

## When to Use This Skill

Use this skill when the user is:

- **Installing or setting up asdf** on a new machine (any OS, any shell)
- **Adding plugins** for a language or tool (Node.js, Python, Go, Terraform, kubectl, Helm, etc.)
- **Installing or switching versions** of any tool managed by asdf
- **Managing `.tool-versions` files** — creating, editing, or understanding version resolution
- **Migrating from single-language version managers** like nvm, pyenv, rbenv, goenv, tfenv, or sdkman
- **Configuring shell integration** for Bash, Zsh, Fish, or Elvish
- **Debugging version resolution** — wrong version active, shims not working, `command not found` errors
- **Onboarding to a project** that uses `.tool-versions` for reproducible environments
- **Setting up CI/CD pipelines** that need deterministic tool versions via asdf
- **Configuring `.asdfrc`** for legacy file support, concurrency, or plugin repository settings

---

## Before Setting Up asdf: Decision Framework

Ask yourself these questions before recommending or configuring asdf:

1. **Multi-tool needs**: Does this project need version control for 2+ tools? (If only Node.js, nvm might be sufficient. If 5+ tools, asdf wins.)

2. **Team shell diversity**: Will the team use different shells (Bash, Fish, Zsh)? If yes, test asdf in each shell—shim resolution differs.

3. **CI/CD determinism**: Does CI/CD require identical tool versions across all runs? asdf + .tool-versions guarantees this if you NEVER use `latest`.

4. **Legacy file constraints**: Does the team already use .nvmrc, .ruby-version, or .python-version? Enable `legacy_version_file = yes` in .asdfrc or migrate to .tool-versions (breaking, requires team alignment).

---

## Core Concepts (Minimal)

- **Plugin**: Adapter/repository for a tool (nodejs, python, terraform, kubectl, etc.)
- **.tool-versions**: Project contract—one tool per line, exact versions; asdf traverses up the directory tree to find it
- **Shims**: Lightweight wrappers in `~/.asdf/shims/` that intercept commands and dispatch to the right version
- **Version scopes**: Resolved in order: project `.tool-versions` → parent dirs → `$HOME/.tool-versions` → env var `ASDF_${TOOL}_VERSION`

---

## NEVER Do (Anti-Patterns from Experience)

- **NEVER use `asdf set` directly on a shared `.tool-versions` in production without testing locally first.** Incorrect versions silently break builds for the entire team. Test locally, verify with `asdf current`, then commit.

- **NEVER mix legacy version files (`.nvmrc`, `.ruby-version`) with `.tool-versions` without explicitly configuring `legacy_version_file = yes` in `.asdfrc`.** Ambiguous version resolution causes silent version mismatches that fail only in CI or for specific team members.

- **NEVER assume Bash, Fish, and Zsh handle shims identically.** PATH ordering and shim sourcing differ between shells. If your team uses multiple shells, test the full `.tool-versions` workflow in each shell before committing.

- **NEVER forget to `asdf reshim` after updating a plugin (especially major plugin updates).** Stale shims continue to run outdated tool versions without warning. Reshim is a critical step, not optional.

- **NEVER use `asdf install nodejs latest` in CI pipelines or shared `.tool-versions` files.** "Latest" is non-deterministic; different machines at different times install different versions. Always pin exact versions in `.tool-versions`. Use `asdf install` locally to resolve and write the exact version.

- **NEVER ignore system dependency errors during plugin installation.** Plugin failures (nodejs, python, erlang, ruby) are almost always due to missing build tools (`gnupg`, `build-essential`, `libssl-dev`, etc.), not asdf. Check the plugin's README first; install system dependencies before retrying.

- **NEVER set `ASDF_DATA_DIR` without understanding the consequences.** Custom data dirs bypass shared project configurations. Only use this for isolated development or testing, not in team environments.

---

## Installation

### Dependencies (all platforms)

```bash
# Debian/Ubuntu
sudo apt install -y git curl

# macOS
brew install git curl
```

### Install asdf binary (recommended: binary download)

```bash
# Download latest release from https://github.com/asdf-vm/asdf/releases
# Or via git clone (classic method):
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.16.7
```

### Shell Configuration

**Fish shell** (Jean-Jacques' setup):

```fish
# Add to ~/.config/fish/config.fish
source ~/.asdf/asdf.fish

# Install completions
mkdir -p ~/.config/fish/completions
ln -s ~/.asdf/completions/asdf.fish ~/.config/fish/completions/asdf.fish
```

**Bash**:

```bash
# Add to ~/.bashrc or ~/.bash_profile
. "$HOME/.asdf/asdf.sh"
. "$HOME/.asdf/completions/asdf.bash"
```

**Zsh**:

```zsh
# Add to ~/.zshrc
. "$HOME/.asdf/asdf.sh"
```

After configuration, restart shell or `source` the config file.

---

## Essential Commands

### Plugin Management

```bash
asdf plugin list all              # Browse all available plugins
asdf plugin list all | grep terra # Search for specific plugins
asdf plugin add nodejs            # Add plugin by shortname (from registry)
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git  # Add by URL
asdf plugin list                  # List installed plugins
asdf plugin update nodejs         # Update a plugin
asdf plugin update --all          # Update all plugins
asdf plugin remove nodejs         # Remove plugin + all its installs
```

### Version Management

```bash
asdf list all nodejs              # List all installable versions
asdf list all nodejs 20           # List versions matching prefix
asdf install nodejs latest        # Install latest version
asdf install nodejs 20.11.0       # Install specific version
asdf install                      # Install all versions in .tool-versions
asdf list nodejs                  # List installed versions
asdf uninstall nodejs 18.0.0      # Remove a version
```

### Setting Versions

```bash
asdf set nodejs 20.11.0           # Set version in ./.tool-versions (project)
asdf set -u nodejs 20.11.0        # Set version in ~/.tool-versions (global/user default)
asdf set -p nodejs 20.11.0        # Set in nearest parent .tool-versions
asdf set nodejs latest            # Resolve and write latest version
asdf current                      # Show active version for all tools in cwd
asdf current nodejs               # Show active version for one tool
asdf where nodejs                 # Show install path for active version
asdf which node                   # Show shim path for a command
```

> **Note**: `asdf set` replaced the older `asdf local` / `asdf global` commands in asdf v0.15+. Both still work but `asdf set` is the modern API.

### Environment Variable Override

```bash
# Temporarily override without editing .tool-versions
ASDF_NODEJS_VERSION=18.0.0 node --version
```

---

## .tool-versions Format

```
nodejs 20.11.0
python 3.12.2
terraform 1.7.4
kubectl 1.29.2
golang 1.22.1
```

- One tool per line, `<name> <version>`
- Multiple versions separated by spaces (fallback chain): `python 3.12.2 2.7.18`
- Special keywords: `system` (use OS-installed version), `path:~/my/custom/build`
- Commit to version control — this is the contract for the project's tool versions

---

## .asdfrc Configuration

Located at `~/.asdfrc`:

```ini
# Support .nvmrc, .ruby-version, etc. (per-plugin support required)
legacy_version_file = yes

# Keep downloaded archives (useful for slow connections)
always_keep_download = no

# Concurrency for parallel installs
concurrency = auto

# Plugin repository refresh interval in minutes
plugin_repository_last_check_duration = 60
```

---

## Common Plugins for DevOps/Cloud (Jean-Jacques' stack)

| Tool       | Plugin add command          |
| ---------- | --------------------------- |
| Node.js    | `asdf plugin add nodejs`    |
| Python     | `asdf plugin add python`    |
| Go         | `asdf plugin add golang`    |
| Terraform  | `asdf plugin add terraform` |
| kubectl    | `asdf plugin add kubectl`   |
| Helm       | `asdf plugin add helm`      |
| gcloud CLI | `asdf plugin add gcloud`    |
| Skaffold   | `asdf plugin add skaffold`  |
| Java       | `asdf plugin add java`      |
| Ruby       | `asdf plugin add ruby`      |
| Erlang     | `asdf plugin add erlang`    |
| Elixir     | `asdf plugin add elixir`    |

Many plugins may require system dependencies — always check the plugin's README before installing.

---

## Migration from Other Version Managers

Enable legacy file support in `~/.asdfrc`:

```ini
legacy_version_file = yes
```

| Old file          | Tool                     |
| ----------------- | ------------------------ |
| `.nvmrc`          | nodejs (via asdf-nodejs) |
| `.node-version`   | nodejs                   |
| `.ruby-version`   | ruby (via asdf-ruby)     |
| `.python-version` | python (via asdf-python) |

---

## Troubleshooting

### Shims not working / command not found

```bash
asdf reshim nodejs          # Regenerate shims for a plugin
asdf reshim                 # Regenerate all shims
echo $PATH                  # Verify ~/.asdf/shims is early in PATH
type -a node                # Fish: check which binary is resolved
```

**Common cause**: Shell config was modified but not reloaded. Run `source ~/.bashrc` (or equivalent for your shell) to reload.

**PATH conflicts**: If nvm, pyenv, or rbenv entries are still in your PATH before `~/.asdf/shims`, those managers' shims will shadow asdf. Remove or reorder PATH entries.

### Version not being picked up

```bash
asdf current                # See what version is resolved and from where
# Look for "No version set" warnings
# Check .tool-versions exists in project dir or a parent
```

**Silent version mismatch**: Team members may have different versions if `.tool-versions` isn't committed, or if `legacy_version_file = yes` causes different files to load (.nvmrc vs .tool-versions). Always commit `.tool-versions`.

### Plugin install failures

- Check plugin README for system dependency requirements
- Ensure git is installed and accessible
- For nodejs: may need `gnupg` for keyring verification

**Slow or stalled downloads**: If `asdf install` stalls during download, ensure `always_keep_download = no` in `.asdfrc` so partial downloads are kept. Resume with the same command.

**Network timeouts in CI**: For CI environments with slow/unreliable networks, add retry logic:

```bash
for attempt in {1..3}; do asdf install && break || sleep 5; done
```

### Conflicting version managers

**Problem**: Multiple version managers (nvm, pyenv, asdf) in PATH cause version conflicts.

**Solution**:

```bash
# Check what's in PATH
echo $PATH | tr ':' '\n'

# Remove conflicting managers from shell config
# Only asdf should manage tool versions
# Edit ~/.bashrc, ~/.zshrc, or ~/.config/fish/config.fish
# Delete or comment out nvm/pyenv initialization lines
```

### Data directory

Default: `~/.asdf/` — override with `export ASDF_DATA_DIR=/custom/path` in shell config. Only use for isolated development, not shared team environments.

---

## Typical Project Onboarding Workflow

```bash
# 1. Clone project
git clone <repo> && cd <repo>

# 2. Add plugins for each tool in .tool-versions (if not already added)
asdf plugin add nodejs
asdf plugin add python

# 3. Install all versions specified in .tool-versions
asdf install

# 4. Verify
asdf current
```

---

## Reference

- Full docs: https://asdf-vm.com/
- Plugin list: https://github.com/asdf-vm/asdf-plugins
- All commands: `asdf --help` or `asdf <command> --help`
