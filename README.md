# Habit Tracker App

Semesterprojekt **Mobile App Development** (React Native mit Expo).

Die App hilft Nutzerinnen und Nutzern, ihre **täglichen** Gewohnheiten (Habits) zu erfassen, Erledigungen zu tracken und Fortschritte/Streaks zu sehen.

## Inhalt

- [Funktionen](#funktionen)
- [Setup](#setup)
- [Projektstruktur](#projektstruktur)
- [Technologien](#technologien)
- [Annahmen](#annahmen)
- [Grenzen](#grenzen)
- [Verantwortlichkeiten](#verantwortlichkeiten)
- [Ausblick](#ausblick)

---

## Funktionen

- **Habits anlegen**
  - Titel, Beschreibung erforderlich
  - Speichern in einer lokalen Datenbank (SQLite/AsyncStorage via `lib/database.*`)
  - Validierung: Pflichtfelder, Button nur aktiv bei gültiger Eingabe, Inline-Fehlermeldungen

- **Übersicht**
  - Liste aller Habits
  - Wöchentliche Übersicht (Kalenderwoche + Tage)
  - Tägliches Abhaken, pro Tag nur 1× möglich
  - Bearbeiten eines Habits (Titel/Beschreibung) über Dialog
  - Löschen eines Habits 

- **Streaks**
  - Aktueller Streak (an wie vielen Tagen in Folge erledigt)
  - Bester Streak
  - Gesamtanzahl Erledigungen
  - Wochenfortschritt (z. B. 4 / 7) mit Progress-Bar

- **Navigation**
  - Bottom-Tab-Navigation mit drei Tabs:
    - Übersicht
    - Neues Habit hinzufügen
    - Streaks
  - Header angepasst, konsistente Titel & Farben

---

## Setup
- NodeJs und Expo Go installieren
- Repository klonen
- npx expo start (im Terminal eingeben)
- w (im Terminal eingeben)
- Danach wird die Habit-App im Browser angezeigt (Einfachste Variante)

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
```
---

## Technologien
- React Native mit Expo
- expo-router für Navigation (Stack + Tabs)
- TypeScript
- react-native-paper für UI-Komponenten (Karten, Buttons, Inputs, Dialoge)
- Native (iOS/Android): SQLite über lib/database.native.ts (expo-sqlite)
- Web: Browser localStorage über lib/database.web.ts

---

## Annahmen

- Die App wird von **einer** Person auf **einem** Gerät verwendet.
- Alle Daten werden lokal auf dem Gerät gespeichert  
  - Native: SQLite  
  - Web: `localStorage`
- Die Systemzeit und Zeitzone des Geräts sind korrekt. Streaks und Wochenansicht basieren auf dem aktuellen Datum.
- Habits werden als tägliche Gewohnheiten verstanden (Ziel: 7 Erledigungen pro Woche).

---

## Grenzen

- Es gibt keine Cloud-Synchronisation und kein Backup.
- Es gibt keine Authentifizierung (kein Login, keine Benutzerverwaltung).
- Pro Habit kann ein Tag nur einmal über das Häckchen-Icon als erledigt markiert werden. Nachträgliches Bearbeiten/Löschen einzelner Erledigungen ist nicht vorgesehen.
- Das Wochenziel ist aktuell fix auf 7 gesetzt.
- Die App ist derzeit nur auf Deutsch verfügbar.
- Es gibt keine Push-Notifications oder Erinnerungen. Die App zeigt den Status nur, wenn sie aktiv geöffnet wird.

---

## Verantwortlichkeiten

- Das Projekt wurde von Jeannine Popp und Irina Mächler kollaborativ konzipiert und umgesetzt.
- Entscheidungen zu Funktionen, Screens und zum Design wurden immer vorab gemeinsam getroffen. Beide haben abwechselnd am Projekt weitergearbeitet.

- Jeannine 
  - Fokus auf Streak-Logik (Berechnung aktueller/bester Streak, Wochenfortschritt)
  - Datenhaltung und -zugriff (z.B. localStorage, Database)

- Irina
  - Fokus auf Erstellung, Bearbeitung und Löschen von Habits.
  - Einheitliches UI

---

## Ausblick

Mögliche Erweiterungen, die wir für spätere Versionen der App sehen:
- Erinnerungen für einzelne Habits, damit nichts vergessen geht
- Flexible Häufigkeiten (z.B. 3x pro Woche)
- Login, Benutzerverwaltung
- Erweiterte Statistiken und Auswertungen (Monatsübersicht, Diagramme)
- Mehrsprachigkeit (z.B. zusätzlich auch Englisch)

---
## Demo

Ein Screen-Video kann unter dem folgenden Link aufgerufen werden: https://fhgraubuenden-my.sharepoint.com/:f:/g/personal/maechleirina_fhgr_ch/Ei9Bf2MNxutDrLKsgqS2_awB0PstmYquDAJPoOfKe194Pg?e=r3TiGX


