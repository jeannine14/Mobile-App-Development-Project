import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, SegmentedButtons, Button } from "react-native-paper";

const FREQUENCIES = ["daily", "weekly", "monthly"] as const;
type Frequency = (typeof FREQUENCIES)[number];

export default function AddHabitScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");

  const handleSubmit = () => {
    // TODO: Speichern/Navigation
    console.log({ title, description, frequency });
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        mode="outlined"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        label="Definition"
        mode="outlined"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <View style={styles.frequencyContainer}>
        <SegmentedButtons
          value={frequency}
          onValueChange={(v) => setFrequency(v as Frequency)}
          buttons={FREQUENCIES.map((freq) => ({
            value: freq,
            label: freq.charAt(0).toUpperCase() + freq.slice(1),
          }))}
        />
      </View>

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
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5", justifyContent: "center" },
  input: { marginBottom: 16 },
  frequencyContainer: { marginBottom: 24 },
});
