# github-query

A cross platform tool for querying and displaying GitHub repository metrics.

## Usage

### Configuration

Create `.env with content:

```bash
GITHUB_TOKEN=[Your GitHub personal access token]
```

The token must have the following permission:

- `repo`
- `read:gpg_key`
- `read:org`
- `read:public_key`
- `read:repo_hook`
- `read:user`
- `user:email`

### Quickstart

```bash
npx @dev-sam/github-query --help
npx @dev-sam/github-query SamChou19815/github-query
```
