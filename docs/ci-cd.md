# CI/CD DevSecOps

The `DevSecOps pipeline` builds one static artifact, validates it with tests, dependency audit, CodeQL, and E2E, then deploys it to the protected production environment.

## Required GitHub setup

Create the `production` environment. In **Settings → Environments → production**, add only the repository owner `SergioEvando23` as required reviewer and disable admin bypass where available. This cannot be enforced in workflow YAML. Protect `main`: require pull requests and the checks `Build, tests and coverage`, `Dependency validation`, `CodeQL`, `E2E against build artifact`, and `Dependency review`.

## E2E and rollback

The E2E job downloads the `out/` artifact produced by `build_test` and serves it locally, so it validates the same static build that production deploys. Failed E2E reports are retained for seven days. For local work, Playwright starts the development server by default.

To roll back production, run the GitHub Pages deployment workflow from the last known-good commit, after the same gates and production approval. GitHub Actions records the commit SHA and artifact used by each deployment.
