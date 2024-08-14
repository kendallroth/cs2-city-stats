# Contributing

## Development

### Code Development

- Open solution in Visual Studio
- _Make changes..._
- Build solution/project (automatically outputs to CS2 `Mods/` folder)

### UI Development

- Open `UI` folder in text editor
- Start development server (`npm run start`)
- _Make changes (automatically updates via HMR)_

```sh
# Start development server
npm run start
```

#### Code Quality

All UI changes should be formatted, linted, and type checked before review!

- Code formatting (`npm run code:format`)
- Code linting (`npm run code:lint`
- TS type checking (`npm run code:type`)

## Testing Forks

Forked changes can be tested by adding a new Git `remote` to the forked repository, then checking out a local branch from the forked remote.

```sh
# https://stackoverflow.com/a/69758165/4206438

git remote add forked https://github.com/something/something.git
git fetch forked
git checkout -b otherDevelopersBranch forked/otherDevelopersBranch

# Cleanup fork remote after testing
git remote remove forked
```