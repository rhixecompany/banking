# OpenCode API Provider Setup Tutorial

This guide walks you through setting up three free/paid AI providers for OpenCode: Google Vertex (Gemini), Anthropic (Claude), and OpenAI (GPT-5). Choose one or all based on your needs.

---

## Option 1: Google Vertex AI (Gemini 2.5 Flash) - Recommended Free

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Name it (e.g., `opencode-gemini`) → Click **Create**

### Step 2: Enable Vertex AI API

1. In your project, go to **APIs & Services** → **Library**
2. Search for **Vertex AI API**
3. Click **Enable**

### Step 3: Get API Key (Express Mode - Easiest)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. If prompted, accept Terms of Service
3. Click **Create API Key**
4. Copy the key (shown only once!)

### Step 4: Configure OpenCode

Edit `.opencode/.env`:

```bash
# Add to .opencode/.env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Edit `.opencode/opencode.json`:

```json
"model": "google-vertex/gemini-2.5-flash",
```

### Step 5: Verify It Works

Run:

```bash
opencode --model google-vertex/gemini-2.5-flash "Hello, test response"
```

---

## Option 2: Anthropic (Claude Haiku 4.5) - Best for Coding

### Step 1: Create Account

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up with email + phone verification (required)

### Step 2: Add Billing (Required for API Access)

1. Go to **Settings** → **Plans & Billing**
2. Click **Add payment method**
3. Enter credit card details
4. **Add at least $5** - This unlocks Tier 1 (50 RPM vs. free tier's 5 RPM)

### Step 3: Generate API Key

1. Go to **Settings** → **API Keys** (or [direct link](https://console.anthropic.com/settings/keys))
2. Click **Create Key**
3. Name it (e.g., `opencode-dev`)
4. **Copy immediately** - key shown only once!

### Step 4: Configure OpenCode

Edit `.opencode/.env`:

```bash
# Add to .opencode/.env
ANTHROPIC_API_KEY=sk-ant-api03-your_key_here
```

Edit `.opencode/opencode.json`:

```json
"model": "anthropic/claude-haiku-4-5",
```

### Step 5: Verify It Works

```bash
opencode --model anthropic/claude-haiku-4-5 "Hello, test response"
```

### Pricing (Haiku = Cheapest)

| Model | Input | Output | Best For |
| --- | --- | --- | --- |
| Claude Haiku 4.5 | $0.80/1M | $4.00/1M | High volume, fast responses |
| Claude Sonnet 4.6 | $3.00/1M | $15.00/1M | Balanced coding |
| Claude Opus 4 | $15.00/1M | $75.00/1M | Complex reasoning |

---

## Option 3: OpenAI (GPT-5.1 Codex Max)

### Step 1: Create Developer Account

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up (new accounts may get $5 trial credit)

### Step 2: Get API Key

1. Go to **API Keys** → **Create new secret key**
2. Name it (e.g., `opencode-key`)
3. Copy the key (shown only once!)

### Step 3: Add Billing (If No Trial Credit)

1. Go to **Settings** → **Billing**
2. Add payment method
3. Pre-load credits (pay-as-you-go)

### Step 4: Configure OpenCode

Edit `.opencode/.env`:

```bash
# Add to .opencode/.env
OPENAI_API_KEY=sk-your_openai_key_here
```

Edit `.opencode/opencode.json`:

```json
"model": "openai/gpt-5.1-codex-max",
```

### Step 5: Verify It Works

```bash
opencode --model openai/gpt-5.1-codex-max "Hello, test response"
```

### Pricing (GPT-5.1)

| Model        | Input    | Output    |
| ------------ | -------- | --------- |
| GPT-5.4 mini | $0.75/1M | $4.50/1M  |
| GPT-5.4      | $2.50/1M | $15.00/1M |
| GPT-5.5      | $5.00/1M | $30.00/1M |

---

## Quick Comparison

| Provider | Model | Free Tier | Best For |
| --- | --- | --- | --- |
| **Google** | Gemini 2.5 Flash | $0 for 90-day trial, then pay-as-you-go | Fast, cheap, good coding |
| **Anthropic** | Claude Haiku 4.5 | $5 minimum deposit, then pay-per-use | Best coding quality |
| **OpenAI** | GPT-5.4 mini | $5 trial credit for new accounts | Latest models |

---

## Troubleshooting

### "API key not found"

- Ensure environment variable is set in `.opencode/.env`
- Restart OpenCode after editing env file

### "Rate limit exceeded"

- Wait for reset (usually minutes to hours)
- For Anthropic: deposit $5 to unlock Tier 1 (50 RPM)

### "Invalid API key"

- Double-check key format:
  - Anthropic: `sk-ant-api03-...`
  - OpenAI: `sk-...`
  - Google: `AIza...`

---

## Switching Between Providers

To switch models in OpenCode, edit `.opencode/opencode.json`:

```json
// Use Google Gemini
"model": "google-vertex/gemini-2.5-flash",

// Use Anthropic Claude
"model": "anthropic/claude-haiku-4-5",

// Use OpenAI GPT-5
"model": "openai/gpt-5.1-codex-max",

// Use built-in free (no config needed)
"model": "opencode/minimax-m2.5-free",
```

Or use CLI flag:

```bash
opencode --model anthropic/claude-haiku-4-5 "your prompt"
```
