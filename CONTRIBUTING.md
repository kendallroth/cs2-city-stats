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

## Game Assets

### Decomplilation

To access decompiled results, use a tool like ILSpy to open the `Game.dll` file (found in Steam installation). Then "Save" the project after decompiling to output a C# project for searching/learning.

### Media

Game media can be found at `steamapps\common\Cities Skylines II\Cities2_Data\StreamingAssets\~UI~\GameUI\Media`.

## Localization

Currently the primary English localization uses the default CO `LocaleEN` C# class, rather than a separate JSON object. However, all other locale files are stored under `Locales/` as JSON. This can make generating localization objects more complex, as there is no easy way to copy the base JSON file. To help with this, the mod automatically dumps the current `LocaleEN` dictionary into a JSON file within `ModsData` upon startup.

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