**Purpose:** A visual and logical guide to the Gitflow model so developers don't accidentally push to production.

```markdown
# Branching Strategy

We use a simplified **Gitflow** workflow.

## 🌳 The Main Branches

### `main` (Production)
- **Status:** Protected.
- **Purpose:** Contains production-ready code ONLY.
- **Who:** Only Tech Leads merge here via PR from `develop`.

### `develop` (Integration)
- **Status:** Protected.
- **Purpose:** The default branch where all features are merged.
- **Who:** All developers merge their feature branches here via PR.

---

## 🌿 Feature Branches (Where you work)

**Naming Convention:**
`feature/<team>/<short-description>`

**Teams:**
- `backend`
- `frontend`
- `security`

**Examples:**
- `feature/backend/create-domain-entities`
- `feature/frontend/setup-routing`
- `feature/security/implement-hmac`

---

## 🚀 Workflow Example

1. **Start a Task:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/backend/mpesa-integration

```

2. **Work & Commit:**
```bash
git add .
git commit -m "feat(payment): add daraja api client"

```


3. **Submit:**
```bash
git push -u origin feature/backend/mpesa-integration

```


*Then go to GitHub and open a Pull Request to `develop`.*

```
