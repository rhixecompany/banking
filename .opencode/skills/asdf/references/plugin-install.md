# asdf Plugin-Specific Installation

This reference file contains plugin-specific installation requirements that MUST be read before adding certain plugins.

## Node.js Plugin

**System dependencies required BEFORE plugin add:**

```bash
# Ubuntu/Debian
sudo apt install -y coreutils curl git gnupg2 automake autoconf libssl-dev libyaml-dev readline libncurses5 libncurses-dev

# macOS
brew install coreutils automake autoconf openssl@1.1 yaml readline
```

**Critical**: Node.js plugin requires `gnupg2` for keyring verification. Install BEFORE running `asdf plugin add nodejs`.

## Python Plugin

**System dependencies required:**

```bash
# Ubuntu/Debian
sudo apt install -y libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev libncurses5 libncurses-dev xz-utils tk-dev liblzma-dev

# macOS
brew install xz readline sqlite3 tcl-tk
```

## Erlang Plugin

**System dependencies (complex):**

```bash
# Ubuntu/Debian
sudo apt install -y autoconf libncurses-dev openssl libssl-dev wget

# erlang requires kerl for building - see asdf-erlang documentation
```

## Common Failure Modes

- "Missing OpenSSL" → Install libssl-dev before plugin add
- "keyring verify failed" → Install gnupg2 and retry
- "libyaml not found" → Install libyaml-dev

**Do NOT** attempt plugin installation without first reading these requirements.
