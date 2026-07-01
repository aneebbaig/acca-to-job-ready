<!-- Keep the title in Conventional Commit style, e.g. "feat: add glossary". -->

## What & why

<!-- What does this change and why? Link any related issue: Closes #123 -->

## How to test

<!-- Steps a reviewer can follow to verify this locally. -->

## Checklist

- [ ] `npm run lint` and `npx tsc --noEmit` pass
- [ ] `npm run build` passes
- [ ] No fabricated learning URLs; standard numbers / rates / fees link out, not asserted
- [ ] No API keys, secrets, or personal data added
- [ ] Curriculum changes are in `src/curriculum/*` (data), not hardcoded in components
- [ ] Docs updated if behaviour changed
