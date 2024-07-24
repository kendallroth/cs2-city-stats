# Cities Skylines 2: City Stats

A mod for Cities Skylines 2 that allows viewing overall statistics of the city at a glance.

## Usage

The statistics panel can be opened with `ctrl + shift + s` (rebindable) or with the top-left menu button (bar chart icon). Statistics will change between green (good) to red (bad) depending on their value. For the most part this aligns with the Infoview charts where possible; however, some statistics are represented differently for visual purposes.

The display can be switched between vertical/horizontal modes (in Settings). Additionally, individual statistics can be toggled/hidden via the "settings" icon on the panel (stored per save).

## Features

- Toggleable statistics panel (with keybinding)
- Toggleable individual stats (stored per save)

### Statistics

- Electricity / Water / Sewage availability
- Garbage processing, Landfill availability
- Healthcare availability, Cemetery availability, Crematorium availabilty
- Fire hazard, Crime rate, Shelter availability
- Elementary / Highschool / College / University availability
- Unemployment, Mail availability, Parking availability

### Settings (global)

- Toggle whether panel is open upon load
- Change panel orientation (resets position!)
- Keybinding for toggling panel visibility

## Roadmap

- Localization
- Minor details
  - Animate panel opening/closing
  - Show statistic value in tooltip (or under icon)
  - Disable icons until "unlocked" (ie. health/death care, garbage, etc)
  - Improve police statistics (crime rate may not be useful)
- Calculate homeless percentage
  - Inspiration: [ByeByeHomeless Mod](https://github.com/wxdao/CS2-ByeByeHomelessMod/blob/main/ByeByeHomelessMod/Mod.cs)

![screenshot](./CityStats/Properties/Screenshots/screenshot_4_closeup.png)

## Credits

- All the lovely people who worked on similar mods for Cities Skylines 1!
- For all their help with questions about modding/ECS: Krzychu1245, T. D. W. ♥
