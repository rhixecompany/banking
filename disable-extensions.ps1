$settingsPath = Join-Path $env:APPDATA "Code\User\settings.json"
$currentContent = Get-Content $settingsPath -Raw -ErrorAction SilentlyContinue
$settings = if ($currentContent) { $currentContent | ConvertFrom-Json } else { [PSCustomObject]@{} }

$disabled = @(
    "github.copilot-chat",
    "eamodio.gitlens",
    "ms-vscode-remote.remote-containers",
    "mhutchie.git-graph",
    "quicktype.quicktype",
    "redis.redis-for-vscode",
    "github.vscode-pull-request-github",
    "github.vscode-github-actions",
    "gruntfuggly.todo-tree"
)

$settings | Add-Member -NotePropertyName "extensions.disabled" -NotePropertyValue $disabled -Force -ErrorAction SilentlyContinue
$settings | ConvertTo-Json -Depth 10 | Set-Content $settingsPath -Encoding UTF8
Write-Host "Disabled 9 heavy extensions. Restart VS Code to apply."