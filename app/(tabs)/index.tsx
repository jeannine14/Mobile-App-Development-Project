import { deleteHabit, getAllHabits } from "@/lib/database";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Platform, RefreshControl, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Divider, IconButton, Text } from "react-native-paper";

type Habit = {
  id?: number | string;
  title: string;
  description?: string;
  frequency: "Täglich" | "Wöchentlich" | "Monatlich";
  streak_count?: number;
  created_at: number;
};

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const rows = await getAllHabits();
    setHabits((rows ?? []).map((h: Habit) => ({ streak_count: 0, ...h })));
  };

  useEffect(() => {
    load();
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleDelete = (id?: number | string) => {
  if (id == null) return;

  if (Platform.OS === "web") {
    const ok = typeof window !== "undefined" && window.confirm("Habit löschen? Das kann nicht rückgängig gemacht werden.");
    if (!ok) return;
    deleteHabit(id).then(load);
    return;
  }

  Alert.alert(
    "Habit löschen?",
    "Das kann nicht rückgängig gemacht werden.",
    [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Löschen",
        style: "destructive",
        onPress: async () => {
          await deleteHabit(id);
          await load();
        },
      },
    ]
  );
};


  const renderItem = ({ item }: { item: Habit }) => (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <View style={styles.row}>
          <View style={styles.colLeft}>
            <Text variant="titleMedium" style={styles.title}>
              {item.title}
            </Text>
            {!!item.description && (
              <Text variant="bodyMedium" style={styles.description}>
                {item.description}
              </Text>
            )}
            <View style={styles.badgesRow}>
              <View style={styles.streakBadge}>
                <MaterialCommunityIcons name="fire" size={16} color="#ff9800" />
                <Text style={styles.streakText}>
                  {(item.streak_count ?? 0)} day streak
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.colRight}>
            <Chip compact mode="outlined" style={styles.freqChip} textStyle={styles.freqText}>
              {item.frequency.charAt(0).toUpperCase() + item.frequency.slice(1)}
            </Chip>
            <IconButton
              icon="trash-can-outline"
              size={20}
              accessibilityLabel="Habit löschen"
              onPress={() => handleDelete(item.id)}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Habit Tracker
        </Text>
        <Button mode="text" onPress={load} icon="reload">
          Reload
        </Button>
      </View>

      <FlatList
        contentContainerStyle={styles.content}
        data={habits}
        keyExtractor={(it, i) => String(it.id ?? i)}
        ItemSeparatorComponent={() => <Divider style={{ opacity: 0 }} />}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>Noch keine Habits – füge über „Habit“ unten eins hinzu.</Text>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f5f5f5" },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
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
  headerTitle: { fontWeight: "700" },

  card: {
    marginVertical: 8,
    borderRadius: 16,
  },

  row: { flexDirection: "row", gap: 12 },
  colLeft: { flex: 1 },
  colRight: { justifyContent: "center", flexDirection: "row", alignItems: "center", gap: 4 },

  title: { color: "#22223b", marginBottom: 4, fontWeight: "700" },
  description: { color: "#6c6c80" },

  badgesRow: { flexDirection: "row", marginTop: 10, gap: 8 },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakText: { marginLeft: 6, color: "#ff9800", fontWeight: "700" },

  freqChip: { backgroundColor: "#ede7f6", borderColor: "#e0d7ff" },
  freqText: { color: "#7c4dff", fontWeight: "700" },

  empty: { textAlign: "center", color: "#666", marginTop: 32 },
});
