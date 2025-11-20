# Habit Tracker App

Semesterprojekt **Mobile App Development** (React Native mit Expo).

Die App hilft Nutzer:innen, ihre Gewohnheiten (Habits) zu erfassen, tägliche Erledigungen zu tracken und Fortschritte/Streaks zu sehen.

## Inhalt

- [Funktionen](#funktionen)
- [Technologien](#technologien)
- [Projektstruktur](#projektstruktur)
- [State-Management & Datenfluss](#state-management--datenfluss)
- [Setup & Ausführung](#setup--ausführung)
- [Hinweise zur Bedienung](#hinweise-zur-bedienung)
- [Bewertungskriterien (Abdeckung)](#bewertungskriterien-abdeckung)
- [Verantwortlichkeiten](#verantwortlichkeiten)
- [Bekannte Einschränkungen / Ausblick](#bekannte-einschränkungen--ausblick)
- [Verwendete Tutorials / Grundlagen](#verwendete-tutorials--grundlagen)

---

## Funktionen

- **Habits anlegen**
  - Titel, Beschreibung
  - Speichern in einer lokalen Datenbank (SQLite/AsyncStorage via `lib/database.*`)
  - Validierung: Pflichtfelder, Button nur aktiv bei gültiger Eingabe, Inline-Fehlermeldungen

- **Übersicht (Index-Tab)**
  - Liste aller Habits
  - Wöchentliche Übersicht (Kalenderwoche + Tage)
  - Tägliches Abhaken („Heute erledigt“) – pro Tag nur 1× möglich
  - Bearbeiten eines Habits (Titel/Beschreibung) über Dialog
  - Löschen eines Habits

- **Streaks (Statistik-Tab)**
  - Aktueller Streak (an wie vielen Tagen in Folge erledigt)
  - Bester Streak
  - Gesamtanzahl Erledigungen
  - Wochenfortschritt (z. B. 4 / 7) mit Progress-Bar

- **Navigation**
  - Bottom-Tab-Navigation mit drei Tabs:
    - Übersicht
    - Neues Habit
    - Streaks
  - Header angepasst, konsistente Titel & Farben

---

## Technologien
- **React Native** mit Expo
- expo-router für Navigation (Stack + Tabs)
- TypeScript
- react-native-paper für UI-Komponenten (Karten, Buttons, Inputs, Dialoge)
- Native (iOS/Android): SQLite über lib/database.native.ts (expo-sqlite)
- Web: Browser localStorage über lib/database.web.ts

---

## Projektstruktur

Grober Überblick:

```text
app/
  _layout.tsx        # Root-Layout mit PaperProvider & Stack
  (tabs)/
    _layout.tsx      # Tab-Navigation (Index, Add Habit, Streaks)
    index.tsx        # Übersicht / Liste der Habits
    add-habit.tsx    # Formular zum Anlegen eines neuen Habits
    streaks.tsx      # Streak-Ansicht / Statistiken

assets/
  images/            # App-Icons, Splash, etc.

lib/
  database.ts        # Abstrakte Datenbank-Funktionen
  database.native.ts # Implementierung für native Plattformen
  database.web.ts    # Implementierung für Web

types/
  router.d.ts        # expo-router Typen (automatisch vom Template)

README.md            # dieses Dokument
