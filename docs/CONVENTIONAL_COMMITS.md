# Conventional Commits Guide

We use the **Conventional Commits** specification. This allows us to automatically track features, fixes, and breaking changes.

## 📝 Format
`type(scope): description`

### 1. Type
Must be one of the following:
- **feat**: A new feature (e.g., adding the booking wizard).
- **fix**: A bug fix (e.g., fixing the payment callback).
- **docs**: Documentation only changes.
- **style**: Formatting, missing semi-colons, etc. (no code change).
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **chore**: Build process or auxiliary tool changes (e.g., updating .gitignore).

### 2. Scope
The module you are working on:
- `backend`
- `frontend`
- `security`
- `database`
- `booking`
- `payment`

### 3. Description
- Use the imperative, present tense: "change" not "changed" nor "changes".
- No period at the end.

## ✅ Examples

**Good:**
- `feat(booking): add idempotent booking validation logic`
- `fix(payment): resolve null reference in M-Pesa callback`
- `style(frontend): format BookingWizard with Prettier`
- `chore(repo): update gitignore to exclude .vs folder`

**Bad:**
- `Fixed the bug` (Vague, wrong tense)
- `Added new page` (Missing scope)
- `WIP` (Never commit WIP to shared branches)