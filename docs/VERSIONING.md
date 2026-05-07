## Release & Versioning Guidelines

This document outlines our standard operating procedure for versioning releases, creating Git tags, and maintaining the project changelog. We strictly adhere to Semantic Versioning (SemVer) principles.

### 1. The Tagging Process
Tags act as immutable snapshots of our codebase at a specific point in time. We use **annotated Git tags** for all releases, as they contain the tagger's name, email, date, and a tagging message.

**Step-by-Step Guide to Tagging a Release:**

1. Ensure your local repository is up to date and you are on the primary branch (e.g., `main` or `master`).
2. Verify that your working tree is clean and all tests are passing.
3. Create an annotated tag using the `git tag` command. Replace the version number with your target version:
   ```bash
   git tag -a v1.2.0 -m "Release version 1.2.0"
   ```
4. Push the tag to the remote repository so it triggers any automated release pipelines (CI/CD) and becomes visible to the team:
   ```bash
   git push origin v1.2.0
   ```

### 2. Versioning Convention (Semantic Versioning)
We format our release tags as `vMAJOR.MINOR.PATCH` (e.g., `v2.4.1`). The `v` prefix is standard practice to denote a version tag.

The three numbers increment based on the scope and impact of the changes being released:

| Version Tier | Increment When... | Example Scenario |
| :--- | :--- | :--- |
| **MAJOR** (`X.0.0`) | You make incompatible, breaking API changes. | Removing an existing endpoint, completely changing a data model, or dropping support for an older OS. |
| **MINOR** (`0.X.0`) | You add functionality in a backwards-compatible manner. | Adding a new feature, adding a new optional parameter to an API, or introducing a new dashboard module. |
| **PATCH** (`0.0.X`) | You make backwards-compatible bug fixes. | Fixing a typo, patching a security vulnerability, or resolving a UI glitch. |

**Important Rules for Version Incrementing:**
* Once a versioned package has been released, the contents of that version **must not** be modified. Any modifications must be released as a new version.
* Major version zero (`0.y.z`) is for initial development. Anything may change at any time. The public API should not be considered stable.
* Incrementing a MAJOR version resets both MINOR and PATCH to `0`. Incrementing a MINOR version resets PATCH to `0`.

### 3. Pre-Release Tags
If a build is not yet ready for production but needs to be deployed for testing or preview, append a hyphen and a pre-release identifier to the version string.

* **Alpha:** `v1.2.0-alpha.1` (Internal testing, features may be incomplete)
* **Beta:** `v1.2.0-beta.1` (External testing, feature complete but potentially buggy)
* **Release Candidate:** `v1.2.0-rc.1` (Potential final release, pending final QA sign-off)

### 4. Maintaining the Changelog
Every tagged release must be accompanied by an update to the `CHANGELOG.md` file. We follow the "Keep a Changelog" format to ensure readability for humans.

Group changes under the version header using the following standardized labels:

* **Added:** For new features.
* **Changed:** For changes in existing functionality.
* **Deprecated:** For soon-to-be removed features.
* **Removed:** For now removed features.
* **Fixed:** For any bug fixes.
* **Security:** In case of vulnerabilities.

**Example Changelog Entry:**
```markdown
## [1.2.0] - 2024-10-25
### Added
- User profile picture upload functionality.
- Export to CSV button on the reporting dashboard.

### Changed
- Increased session timeout limit from 15 minutes to 30 minutes.

### Fixed
- Resolved an issue where password reset emails were occasionally delayed.
```