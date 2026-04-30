---
name: nuget-manager
description: Manage NuGet packages safely using the `dotnet` CLI and prescribed update workflows.
lastReviewed: 2026-04-29
applyTo: "**/*.csproj"
platforms:
  - opencode
  - cursor
  - copilot
---

# NuGet Package Manager - Banking Project Guidelines

## Overview

This skill provides comprehensive guidelines for managing NuGet packages in .NET projects. It covers safe update workflows, dependency resolution, and best practices for the Banking project.

## Multi-Agent Commands

### OpenCode

```bash
# List outdated packages
dotnet list package --outdated

# Add package
dotnet add package <package-name>

# Update package
dotnet add package <package-name> --version <version>
```

### Cursor

```
@nuget-manager
Update the banking SDK to latest version
```

### Copilot

```
/nuget add Newtonsoft.Json
```

## Package Management Basics

### Listing Packages

```bash
# List all packages in project
dotnet list package

# List outdated packages
dotnet list package --outdated

# List transitive packages
dotnet list package --include-transitive
```

### Adding Packages

```bash
# Add latest version
dotnet add package Newtonsoft.Json

# Add specific version
dotnet add package Newtonsoft.Json --version 13.0.3

# Add with source
dotnet add package Newtonsoft.Json --source https://api.nuget.org/v3/index.json
```

### Removing Packages

```bash
# Remove package
dotnet remove package Newtonsoft.Json
```

## Safe Update Workflow

### Step 1: Audit Current State

```bash
# Check for outdated packages
dotnet list package --outdated

# Check for vulnerabilities
dotnet nuget trust list  # List trusted sources
```

### Step 2: Review Breaking Changes

```bash
# Check package release notes
dotnet package search <package-name> --take 5

# View changelog
# Visit: https://github.com/<owner>/<repo>/blob/main/CHANGELOG.md
```

### Step 3: Update in Isolation

```bash
# Update single package
dotnet add package <package-name> --version <new-version>

# Build to verify
dotnet build --no-restore

# Run tests
dotnet test
```

### Step 4: Commit and Verify

```bash
# Stage changes
git add *.csproj

# Commit
git commit -m "chore: update <package> to v<version>"
```

## Dependency Resolution

### Version Constraints

```xml
<!-- Exact version -->
<PackageReference Include="Newtonsoft.Json" Version="13.0.3" />

<!-- Minimum version -->
<PackageReference Include="Newtonsoft.Json" Version="13.0.0" />

<!-- Range -->
<PackageReference Include="Newtonsoft.Json" Version="[13.0.0,14.0.0)" />

<!-- Floating -->
<PackageReference Include="Newtonsoft.Json" Version="13.*" />
```

### Recommended Constraints

```xml
<!-- Banking project - prefer stable versions -->
<PackageReference Include="Dapper" Version="2.1.35" />
<PackageReference Include="Microsoft.Data.SqlClient" Version="5.2.2" />
<PackageReference Include="Serilog" Version="4.0.2" />
```

### Transitive Dependencies

```bash
# View dependency tree
dotnet msbuild /t:Restore /p:ShowAllProjects /p:ShowTargets=PrintDependencies

# Or use dotnet-outdated-tool
dotnet tool install --global dotnet-outdated
dotnet outdated --upgrade
```

## Vulnerability Scanning

### Check for Vulnerabilities

```bash
# Scan for vulnerabilities
dotnet nuget list source

# Use GitHub Advisory Database
dotnet audit

# Check specific package
dotnet nuget search <package-name> --take 5
```

### Remediate Vulnerabilities

```xml
<!-- Update vulnerable package -->
<PackageReference Include="Newtonsoft.Json" Version="13.0.3" />

<!-- Or add vulnerability bypass (temporary) -->
<PackageReference Include="Vulnerable.Package" Version="1.0.0">
  <NoWarn>NU1701</NoWarn>
</PackageReference>
```

## Version Management

### Semantic Versioning

- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

### Update Strategies

```bash
# Patch update (safe)
dotnet add package Newtonsoft.Json --version 13.0.2

# Minor update (review changelog)
dotnet add package Newtonsoft.Json --version 13.1.0

# Major update (full testing required)
dotnet add package Newtonsoft.Json --version 14.0.0
```

### Lock Files

```json
// Directory.Build.props
<PropertyGroup>
  <RestorePackagesWithLockFile>true</RestorePackagesWithLockFile>
  <DisablePackageDowngrades>true</DisablePackageDowngrades>
</PropertyGroup>
```

## Banking Project Packages

### Core Dependencies

```xml
<Project>
  <ItemGroup>
    <!-- Database -->
    <PackageReference Include="Dapper" Version="2.1.35" />
    <PackageReference Include="Microsoft.Data.SqlClient" Version="5.2.2" />
    <PackageReference Include="Drizzle.Orm" Version="1.0.0" />

    <!-- Logging -->
    <PackageReference Include="Serilog" Version="4.0.2" />
    <PackageReference Include="Serilog.Sinks.Console" Version="6.0.0" />

    <!-- Configuration -->
    <PackageReference Include="Microsoft.Extensions.Configuration" Version="8.0.0" />
    <PackageReference Include="Microsoft.Extensions.Configuration.Json" Version="8.0.0" />
  </ItemGroup>
</Project>
```

### Security Packages

```xml
<ItemGroup>
  <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
  <PackageReference Include="FluentValidation" Version="11.9.0" />
  <PackageReference Include="Cryptography" Version="8.0.0" />
</ItemGroup>
```

## Troubleshooting

### Package Restore Fails

**Problem**: `Unable to find package` **Solutions**:

1. Check nuget source configuration
2. Verify package name and version
3. Clear cache: `dotnet nuget locals all --clear`

### Version Conflict

**Problem**: `Package X version Y is not compatible with` **Solutions**:

1. Check framework compatibility
2. Use version ranges instead of exact versions
3. Add binding redirects

### Lock File Issues

**Problem**: `Package lock file is out of sync` **Solutions**:

1. Delete `packages.lock.json`
2. Run `dotnet restore`
3. Commit new lock file

## Best Practices

### 1. Use Lock Files

```xml
<PropertyGroup>
  <RestorePackagesWithLockFile>true</RestorePackagesWithLockFile>
</PropertyGroup>
```

### 2. Pin Major Versions

```xml
<!-- Prefer exact or constrained versions -->
<PackageReference Include="Serilog" Version="[4.0.0,5.0.0)" />
```

### 3. Audit Regularly

```bash
# Weekly audit
dotnet list package --outdated

# Monthly vulnerability check
dotnet audit
```

### 4. Test After Updates

```bash
# Build and test
dotnet build
dotnet test --no-build
```

## Cross-References

- **security-skill**: For security package management
- **code-philosophy**: For dependency philosophy
- **agent-governance**: For package governance

## Validation Commands

```bash
# Check for outdated packages
dotnet list package --outdated

# Verify package versions
dotnet list package

# Audit for vulnerabilities
dotnet audit

# Check restore
dotnet restore --verbosity detailed
```

## Performance Tips

1. Use parallel restore: `dotnet restore --parallel`
2. Configure HTTP cache
3. Use local NuGet feed for internal packages
4. Avoid restoring during build with lock files
