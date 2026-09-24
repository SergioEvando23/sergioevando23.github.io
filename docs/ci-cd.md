# CI/CD DevSecOps

The `DevSecOps pipeline` promotes one validated static artifact through development, homologation and production: build/tests/coverage, dependency audit, CodeQL, DSV smoke check, HML smoke check, E2E against `E2E_BASE_URL`, then the protected production environment.

## Required GitHub setup

Create `development`, `homologation` and `production` environments. Set `FIREBASE_PROJECT_ID` and `DEPLOY_URL` as environment variables. Store `FIREBASE_SERVICE_ACCOUNT` only as an environment/repository secret.

Create Firebase Hosting targets named `development` and `homologation` for isolated Firebase projects/sites. Do not reuse production Firebase data. Production remains GitHub Pages.

The target-to-site mapping belongs in the ignored `.firebaserc` of the deployment environment, for example `firebase target:apply hosting development <dev-site-id>` and `firebase target:apply hosting homologation <hml-site-id>`. The service-account secret must have access only to the intended non-production project/site.

In **Settings → Environments → production**, add only the repository owner `SergioEvando23` as required reviewer and disable admin bypass where available. This cannot be enforced in workflow YAML. Protect `main`: require pull requests and the checks `Build, tests and coverage`, `Dependency validation`, `CodeQL`, and `Dependency review`.

## E2E and rollback

The workflow sets `E2E_BASE_URL` from the homologation environment; Playwright only starts localhost when that variable is absent for local work. Failed E2E reports are retained for seven days.

To roll back production, run the GitHub Pages deployment workflow from the last known-good commit, after the same gates and production approval. GitHub Actions records the commit SHA and artifact used by each deployment.
