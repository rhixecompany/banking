param(
    [Parameter(ValueFromRemainingArguments=$true)]
    $Args
)

# Provenance: batch2 convert-scripts
try {
    & npx tsx scripts/ts/docker/generate-env.ts @Args
    exit $LASTEXITCODE
} catch {
    exit 1
}
