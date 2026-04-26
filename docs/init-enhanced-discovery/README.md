# Init-Enhanced Discovery Outputs

Files produced by automated discovery:

- zod-locations.txt — list of files containing z.object / z.enum / z.array
- server-action-locations.txt — files with "use server" directive
- db-call-locations.txt — files with db. references
- loops.txt — files with for/forEach/.map patterns in lib/
- bank-webhook-locations.txt — files referencing sharableId/fundingSourceUrl/webhook

Run `rg -n "z\.object\(|z\.enum\(|z\.array\(" --hidden --glob '!.git' > docs/init-enhanced-discovery/zod-locations.txt` to regenerate.
