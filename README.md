# EU Days

A mobile and web app for tracking time spent in the Schengen Area against the 90/180-day rolling window rule.

## What it does

The Schengen short-stay rule allows a maximum of 90 days in any 180-day period. EU Days lets you log trips to Schengen countries and instantly see how many days you've used, how many remain, and when days are about to drop off the rolling window.

### Views

**Timeline** — A scrollable day-by-day list showing your EU day count for each date, colour-coded by threshold (green → amber → red). Each trip is shown as a coloured column. Days inside a trip are highlighted; days in the 180-day tail show a faded/hatched pattern as they count down to dropping off.

**Calendar** — A two-column mini-calendar grid covering all months spanned by your trips. Each cell shows the EU count and coloured trip indicators:
- ▲ Upward triangle — day is inside an active trip
- ● Faded circle — trip has ended but the day is still inside the 180-day window (tail)
- ▼ Downward triangle — day is approaching the end of the window (dropping off)

A **#** toggle in the status bar switches the indicators to numeric contribution counts.

**Trips** — A list of all trips. Trips that have fully expired (>180 days ago) are flagged as "Expired". Overlapping trips are flagged with a warning.

### Adding trips

Tap the **+** button on any tab to add a trip (label, start date, end date). Trips are automatically sorted by start date. Up to 15 trips can be stored. Tap a trip in the Trips tab to edit or delete it.

## Running the app

```bash
npm install
npm start          # Expo dev server
```
Android testing - run device using Android Studio. Expo will auto connect on 'a' input.

## Tech

- [Expo](https://expo.dev) / [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- React Native 0.81 with the New Architecture enabled
- React 19 with React Compiler
- TypeScript
- AsyncStorage (native) / localStorage (web) for persistence
