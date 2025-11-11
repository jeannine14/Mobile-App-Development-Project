import { initDB, insertHabit } from "@/lib/database";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function AddHabitScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    initDB().catch(console.error);
  }, []);

  const handleSubmit = async () => {
    try {
      await insertHabit({
        title,
        description,
        frequency: "Täglich",
        created_at: Date.now(),
      });

      setTitle("");
      setDescription("");
      Alert.alert("Gespeichert", "Dein Habit wurde gespeichert.");
      router.replace("/");
    } catch (err) {
      console.error(err);
      Alert.alert("Fehler", "Konnte nicht speichern.");
    }
  };

  return (
    <View style={styles.page}>
      {/* Header wie bei Index/Streaks */}
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
            // nur Hintergrund lokal setzen, primary kommt aus globalem Theme
            theme={{ colors: { background: "#ececec" } }}
          />
          <TextInput
            label="Beschreibung"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { background: "#ececec" } }}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!title || !description}
            // keine buttonColor nötig – nutzt theme.colors.primary (palevioletred)
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
    marginBottom: 16,
  },
});
