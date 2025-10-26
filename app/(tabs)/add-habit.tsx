import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, SegmentedButtons, Button } from "react-native-paper";
import { initDB, insertHabit } from "@/lib/database";
import { useRouter } from "expo-router"; // ✅ Import für Navigation

const FREQUENCIES = ["Täglich", "Wöchentlich", "Monatlich"] as const;
type Frequency = (typeof FREQUENCIES)[number];

export default function AddHabitScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Täglich");

  const router = useRouter(); // ✅ Router erstellen

  useEffect(() => {
    initDB().catch(console.error);
  }, []);

  const handleSubmit = async () => {
    try {
      await insertHabit({
        title,
        description,
        frequency,
        created_at: Date.now(),
      });

      // Felder zurücksetzen
      setTitle("");
      setDescription("");
      setFrequency("Täglich");

      // Erfolgsmeldung
      Alert.alert("Gespeichert", "Dein Habit wurde gespeichert.");

      // ✅ Zurück zur Hauptseite (Index)
      router.replace("/"); // oder router.push("/")
    } catch (err) {
      console.error(err);
      Alert.alert("Fehler", "Konnte nicht speichern.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Titel"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="Beschreibung"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <SegmentedButtons
        value={frequency}
        onValueChange={(v) => setFrequency(v as Frequency)}
        buttons={FREQUENCIES.map((f) => ({ value: f, label: f }))}
        style={styles.frequencyContainer}
      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!title || !description}
      >
        Habit hinzufügen
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  input: { marginBottom: 16 },
  frequencyContainer: { marginBottom: 24 },
});
