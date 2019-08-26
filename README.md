# github-query

[![Build Status](https://action-badges.now.sh/SamChou19815/github-query)](https://github.com/SamChou19815/github-query)
![GitHub](https://img.shields.io/github/license/SamChou19815/github-query.svg)
![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

A cross platform tool for querying and displaying GitHub repository metrics.

## Design Goals

- Enable cross platform GitHub metrics monitoring;
- Enable better tooling and automation that consumes data collected by this tool;
- **NON-GOAL**: use this tool as the only metric to evaluate performance of engineers.

## Usage

### Configuration

#### GitHub Personal Access Token

Create `backend/configuration.ts` with content:

```typescript
/*
 * The token must have the following permission:
 * - repo
 * - read:gpg_key
 * - read:org
 * - read:public_key
 * - read:repo_hook
 * - read:user
 * - user:email
 */
export const GITHUB_TOKEN = '[Your GitHub personal access token]';
export const DATABASE_URL = '[Your Firebase Database URL]';
```

#### Firebase Admin SDK

1. Create a Firebase project and enable Cloud Firestore.
2. Download your admin SDK json and put it in `backend/firebase-adminsdk.json`

#### Watching Repository Configuration

Create `functions/fetch-configuration.json` with content like:

```json
{
  "limit": 100,
  "frequency": "every 60 minutes",
  "repositories": [
    { "owner": "facebook", "name": "react" },
    { "owner": "microsoft", "name": "TypeScript" },
    { "owner": "SamChou19815", "name": "samlang" }
  ]
}
```

This json decides the repositories you want to watch.
The functions do not ensure automatically that you get the full history of a repository, so you
may need to treak the value of `limit` and `frequency` to ensure that. The syntax of `frequency`
is specified in this
[Google Cloud Docs](https://cloud.google.com/appengine/docs/standard/python/config/cronref#schedule_format).

When you update the json, you need to redeploy the functions again.

### Installation

```bash
./scripts/build-all
```

### CLI

```bash
./github-query-cli
```

```plaintext
Options:
  --version  Show version number                                       [boolean]
  --owner    Owner of the repository. e.g. facebook                   [required]
  --name     Name of the repository. e.g. react                       [required]
  --recent   Only fetch recent information.           [boolean] [default: false]
  --help     Show help                                                 [boolean]
```

### Deployment

1. Setup Firebase for yourself
2. Edit `.firebaserc`, `firebase.json`, and `scripts/deploy-functions` to use your project ID.
3. Run

```bash
# Deploy functions
./scripts/deploy-functions
# Deploy frontend (need to install first)
firebase deploy --only hosting
```

## Architecture Overview

The project is written in pure TypeScript and built by Yarn using its workspace feature.

- `core/` contains type definitions and pure object processor functions. This is the foundation for
  all packages below.
- `backend/` contains the code to fetch data from GitHub GraphQL API, storing and fetching them into
  Firestore. This is the foundation for CLI and Firebase Functions.
- `cli/` contains a simple CLI tool that allows you to fetch and store all or part of the GitHub
  repository history and store them to the database. `./github-query-cli` at the root is its simple
  bash script wrapper.
- `functions/` contains some Firebase functions that maintains the database on the backend.
  Currently, it can fetch data periodically and serve all recent data to the client.
- `frontend/` contains all the frontend code that displays and computes metrics for users.
- `scripts/` contains all scripts to aid development and deployments.

## FAQ

Q: Why NodeJS?

A: To easily deal with JSON.

Q: Why TypeScript?

A: Static typing boosts my productivity and ensures that less things can go wrong.

Q: Is there a NPM package for this?

A: No. The product is far from complete according to my expectation. Versioning everything on NPM
creates too much overhead for me.

Q: I messed up my database, what should I do?

A: Simply wipe it and use the CLI to collect everything again. The database layer is designed in
a way that everything can be safely overridden.
