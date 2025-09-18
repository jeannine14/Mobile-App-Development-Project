# Habit Tracker App

## Projektidee
Die Habit Tracker App unterstützt Nutzer:innen dabei, ihre täglichen Gewohnheiten (Habits) zu verfolgen und motiviert durch eine einfache Visualisierung von Fortschritt und Regelmäßigkeit.  
Die App wird mit **React Native** entwickelt und dient als Semesterprojekt im Modul *Mobile App Development* (HS25, FH Graubünden).

---

## Funktionen
- **Home View**  
  Übersicht über alle Habits mit Name, Fortschritt und täglichem Abhaken.  
  → Von hier aus kann ein neues Habit erstellt oder die Detailansicht geöffnet werden.  

- **Add Habit View**  
  Formular zum Erstellen einer neuen Gewohnheit. Eingabefelder:  
  - Name (z. B. „Meditieren 10 Minuten“)  
  - Wiederholungsrhythmus (täglich, mehrmals pro Woche etc.)  
  - Farbe auswählen  
  - Erinnerung setzen  

- **Detail View**  
  Einzelansicht einer Gewohnheit mit Statistiken und Historie.  
  - Anzeige des Fortschritts in %  
  - Kalenderübersicht mit erledigten Tagen  
  - Diagramm (z. B. Linienchart)  
  - Aktionen: *Reset progress*, *Delete habit*  

- **(Optional) Edit Habit View**  
  Bearbeitung bestehender Habits (gleiche Eingaben wie bei „Add Habit“).  

- **(Optional) Login View**  
  Einfache Login-Maske mit E-Mail & Passwort.  

---

## Navigation
- **Home View** ist der zentrale Einstiegspunkt.  
- Navigation zu:  
  - **Add Habit View** (neue Gewohnheit anlegen)  
  - **Detail View** (Details einer Gewohnheit ansehen)  
- Von der **Detail View** weiter zu:  
  - **Edit Habit View** oder zurück zur **Home View**.  
- Nach dem Erstellen oder Bearbeiten eines Habits erfolgt die Rückkehr zur **Home View**.  

---

## Technische Umsetzung
- Framework: **React Native**  
- Navigation: **React Navigation**  
- State Management: **React Hooks (useState, useEffect)**  
- Datenhaltung: zunächst lokal im State, optional Erweiterung mit **AsyncStorage**  
- UI-Komponenten:  
  - `Text`, `View`, `Image`  
  - `TextInput`, `Button`, `TouchableOpacity`  
  - Listen- und Kartenkomponenten für Habits  

---

## Repository-Struktur
