param(
    [Parameter(ValueFromRemainingArguments=$true)]
    $Args
)

# Provenance: batch2 convert-scripts
try {
    & npx tsx scripts/ts/docker/docker-quickstart.ts @Args
    exit $LASTEXITCODE
} catch {
    exit 1
}
