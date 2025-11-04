import { initDB, insertHabit } from "@/lib/database";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

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
        // nicht sichtbar, aber gespeichert:
        // die DB setzt ohnehin "Täglich" (siehe unten),
        // hier setzen wir es zusätzlich explizit.
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
    <View style={styles.container}>
      <TextInput
        label="Titel"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
        theme={{ colors: { background: "#ececec", primary: "palevioletred" } }}
      />
      <TextInput
        label="Beschreibung"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        mode="outlined"
        theme={{ colors: { background: "#ececec", primary: "palevioletred" } }}
      />

      {/* keine Frequenz-Auswahl mehr */}

      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!title || !description}
        buttonColor="palevioletred"
        textColor="#fff"
      >
        Habit hinzufügen
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5", justifyContent: "center" },
  input: { marginBottom: 16 },
});
