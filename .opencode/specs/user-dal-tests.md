# Spec: user-dal-tests

Scope: repo

# Coverage: user.dal

## Current State

- user.dal.ts at 36.84% Statements, 39.39% Lines
- Test file exists with 4 of 11 methods covered (findById, create, softDelete, hardDelete)

## Target Coverage: 80%+

## Functions to Cover (all 11 methods)

1. findById - single user lookup (already tested)
2. findByEmail - email search
3. findByIdWithProfile - user + profile join (single query, no N+1)
4. create - user creation (already tested)
5. update - partial user updates
6. createWithProfile - transactional user + profile creation
7. updateProfile - upsert logic for user profiles
8. toggleAdmin - flip admin flag (read-then-update)
9. toggleActive - flip active flag (read-then-update)
10. softDelete - sets deletedAt timestamp (already tested)
11. hardDelete - permanent removal (already tested)

## Test Pattern

- Mock db.select().from().where() returns
- Use eq() for single lookups, inArray() for batch queries
- Use vi.mock('@/database/db') for all DB interactions
- Test soft-delete awareness (WHERE deletedAt IS NULL)
- Test transactional behavior in createWithProfile
- Test upsert logic in updateProfile

## Notes

- Method `findAll` does not exist in the actual DAL
- Method `delete` split into softDelete/hardDelete
- Focus on adding 7 new tests for untested methods
