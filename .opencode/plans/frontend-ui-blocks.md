---
plan name: frontend-ui-blocks
plan description: Add shadcn block pages
plan status: active
---

## Idea

Enhance frontend UI by creating demo pages for the three Shadcn blocks: Onboarding Feed 01, Hero Section 41, and Dashboard Shell 01

## Implementation

- 1. Analyze required shadcn/ui components for each block (OnboardingFeed, HeroSection41, DashboardShell)
- 2. Check if carousel, navigation-menu, dropdown-menu, collapsible components are installed
- 3. Install missing shadcn/ui components using bunx shadcn@latest add
- 4. Create app/onboarding-feed-01/page.tsx with OnboardingFeed component
- 5. Create app/hero-section-41/page.tsx with Header and HeroSection components including assets/svg/bistro-logo.tsx
- 6. Create app/dashboard-shell-01/page.tsx with DashboardShell component
- 7. Update navigation in app layout to include links to new demo pages
- 8. Run type-check and lint to verify no errors
- 9. Test pages load correctly with bun run dev

## Required Specs

<!-- SPECS_START -->
<!-- SPECS_END -->
