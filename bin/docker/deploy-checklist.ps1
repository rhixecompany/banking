param(
    [Parameter(ValueFromRemainingArguments=$true)]
    $Args
)

# Provenance: batch2 convert-scripts
try {
    & bunx tsx scripts/ts/docker/deploy-checklist.ts @Args
    exit $LASTEXITCODE
} catch {
    exit 1
}
