import { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  const [habits, setHabits] = useState([
    { id: "1", name: "Meditieren 10 Min", done: false },
    { id: "2", name: "30 Min Lesen", done: true },
  ]);

  // Toggle Habit done/undone
  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, done: !habit.done } : habit
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meine Habits</Text>

      {/* Liste aller Habits */}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.habit}
            onPress={() => toggleHabit(item.id)}
          >
            <Text style={[styles.habitText, item.done && styles.done]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Navigation zu AddHabit */}
      <Link href="/add-habit" style={styles.addButton}>
        ➕ Neues Habit hinzufügen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  habit: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  habitText: {
    color: "#fff",
    fontSize: 16,
  },
  done: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  addButton: {
    marginTop: 20,
    fontSize: 18,
    color: "#ffd33d",
    textAlign: "center",
  },
});
