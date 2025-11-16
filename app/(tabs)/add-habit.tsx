import { initDB, insertHabit } from "@/lib/database";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function AddHabitScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Datenbank einmal initialisieren
  useEffect(() => {
    initDB().catch((err) => {
      console.error(err);
      Alert.alert(
        "Fehler",
        "Die Datenbank konnte nicht initialisiert werden."
      );
    });
  }, []);

  // einfache Validierung
  const titleError = !title.trim();
  const descriptionError = !description.trim();
  const canSubmit = !titleError && !descriptionError && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setSubmitting(true);

      await insertHabit({
        title: title.trim(),
        description: description.trim(),
        frequency: "Täglich",
        created_at: Date.now(),
      });

      setTitle("");
      setDescription("");
      Alert.alert("Gespeichert", "Dein Habit wurde gespeichert.");
      router.replace("/"); // zurück zur Übersicht
    } catch (err) {
      console.error(err);
      Alert.alert("Fehler", "Konnte das Habit nicht speichern.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Habit erstellen
        </Text>
      </View>

      {/* Inhalt */}
      <View style={styles.content}>
        <View style={styles.formCard}>
          <TextInput
            label="Titel"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { background: "#ececec" } }}
            error={titleError}
          />
          {titleError && (
            <Text style={styles.errorText}>Titel ist erforderlich.</Text>
          )}

          <TextInput
            label="Beschreibung"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { background: "#ececec" } }}
            error={descriptionError}
            multiline
          />
          {descriptionError && (
            <Text style={styles.errorText}>
              Beschreibung ist erforderlich.
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!canSubmit}
            loading={submitting}
          >
            Habit hinzufügen
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  headerTitle: {
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  formCard: {
    backgroundColor: "#ececec",
    borderRadius: 24,
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    color: "crimson",
    marginBottom: 8,
    fontSize: 12,
  },
});
