# github-query

[![Build Status](https://github.com/SamChou19815/github-query/workflows/CI/badge.svg)](https://github.com/SamChou19815/github-query)
![GitHub](https://img.shields.io/github/license/SamChou19815/github-query.svg)
![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

A cross platform tool for querying and displaying GitHub repository metrics.

## Design Goals

- Enable cross platform GitHub metrics monitoring;
- Enable better tooling and automation that consumes data collected by this tool;
- **NON-GOAL**: use this tool as the only metric to evaluate performance of engineers.

## Usage

### Configuration

Create `src/data/github-token.ts` with content:

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
export default '[Your GitHub personal access token]';
```

### Installation

```bash
yarn
```

### CLI

```terminal
$ ./github-query-cli
Options:
  --version  Show version number                                       [boolean]
  --repo     Path to the repository. e.g. facebook/react              [required]
  --recent   Only fetch recent information.           [boolean] [default: false]
  --help     Show help                                                 [boolean]
```
