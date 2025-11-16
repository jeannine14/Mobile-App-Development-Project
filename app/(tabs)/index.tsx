import { addCompletion, deleteHabit, getAllCompletions, getAllHabits, updateHabit, type Completion as DBCompletion, type Habit as DBHabit, } from "@/lib/database";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, FlatList, RefreshControl, StyleSheet, View, } from "react-native";
import { Button, Card, Dialog, Divider, IconButton, Portal, Text, TextInput, } from "react-native-paper";

/** ---------- Typen ---------- */
type Habit = DBHabit & { id: number | string };
type Completion = DBCompletion & { id: number | string };

/** ---------- Datums-Helpers ---------- */
const MS_PER_DAY = 86_400_000;
const dayKey = (ms: number) => Math.floor(ms / MS_PER_DAY);

function startOfISOWeek(d: Date) {
  const x = new Date(d);
  const w = (x.getDay() + 6) % 7; // Mo=0 … So=6
  x.setDate(x.getDate() - w);
  x.setHours(0, 0, 0, 0);
  return x;
}

function getISOWeek(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7 + 1; // Mo=1 … So=7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(
    ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
}

function useWeek() {
  return useMemo(() => {
    const today = new Date();
    const kw = getISOWeek(today);
    const weekStart = startOfISOWeek(today);
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const isToday = d.toDateString() === today.toDateString();
      const wday = new Intl.DateTimeFormat("de-DE", { weekday: "short" })
        .format(d)
        .replace(".", "");
      const dayNum = d.getDate();
      return { date: d, label: wday, num: dayNum, isToday };
    });
    return { kw, days };
  }, []);
}

/** ---------- Screen ---------- */
export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const load = async () => {
    const [h, c] = await Promise.all([getAllHabits(), getAllCompletions()]);
    setHabits((h ?? []) as Habit[]);
    setCompletions((c ?? []) as Completion[]);
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

  /** Heutige Erledigung (einmal pro Tag) */
  const completeToday = async (habitId?: number | string) => {
    if (habitId == null) return;
    const today = dayKey(Date.now());
    const hasToday = completions.some(
      (c) =>
        String(c.habit_id) === String(habitId) &&
        dayKey(c.completed_at) === today
    );

    if (hasToday) {
      Alert.alert(
        "Schon erledigt",
        "Dieses Habit ist für heute bereits als erledigt markiert."
      );
      return;
    }

    await addCompletion(habitId as any, Date.now());
    await load();
  };

  /** Speichern aus dem Bearbeiten-Dialog */
  const handleSaveEdit = async () => {
    if (!editHabit) return;
    const newTitle = editTitle.trim();
    const newDescription = editDescription.trim();

    if (!newTitle) {
      Alert.alert(
        "Titel erforderlich",
        "Bitte gib einen Titel für dein Habit ein."
      );
      return;
    }

    await updateHabit(String(editHabit.id), {
      title: newTitle,
      description: newDescription,
    });

    await load();
    setEditHabit(null);
  };

  const { kw, days } = useWeek();

  const renderItem = ({ item }: { item: Habit }) => {
    // Wochenfortschritt: Anzahl completions dieser Woche (max 7)
    const thisWeekCount = completions.filter(
      (c) =>
        String(c.habit_id) === String(item.id) &&
        startOfISOWeek(new Date(c.completed_at)).getTime() ===
          startOfISOWeek(new Date()).getTime()
    ).length;

    return (
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

              {/* 0/7 und 7 kleine Punkte */}
              <View style={styles.counterRow}>
                <Text style={styles.counterText}>{thisWeekCount} / 7</Text>
                <View style={styles.dotsRow}>
                  {Array.from({ length: 7 }).map((_, i) => {
                    const filled = i < thisWeekCount;
                    return (
                      <View
                        key={i}
                        style={[
                          styles.dot,
                          filled ? styles.dotFilled : styles.dotEmpty,
                        ]}
                      />
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Icons: Bearbeiten, Heute erledigt, Löschen */}
            <View style={styles.colRight}>
              <IconButton
                icon="pencil-outline"
                size={20}
                accessibilityLabel="Habit bearbeiten"
                onPress={() => {
                  setEditHabit(item);
                  setEditTitle(item.title);
                  setEditDescription(item.description ?? "");
                }}
              />
              <IconButton
                icon="check-circle-outline"
                size={20}
                accessibilityLabel="Heute erledigt"
                onPress={() => completeToday(item.id)}
              />
              <IconButton
                icon="trash-can-outline"
                size={20}
                accessibilityLabel="Habit löschen"
                onPress={async () => {
                  await deleteHabit(item.id as any);
                  await load();
                }}
              />
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Meine Habits
        </Text>
      </View>

      {/* KW + Tage */}
      <View style={styles.weekHeader}>
        <Text variant="titleMedium" style={styles.kwText}>
          KW {kw}
        </Text>
        <View style={styles.daysRow}>
          {days.map((d) => (
            <View key={d.date.toISOString()} style={styles.dayCol}>
              <Text
                style={[
                  styles.dayNum,
                  d.isToday && [styles.bold, styles.todayText],
                ]}
              >
                {d.num}
              </Text>
              <Text
                style={[
                  styles.dayLabel,
                  d.isToday && [styles.bold, styles.todayText],
                ]}
              >
                {d.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <FlatList
        contentContainerStyle={styles.content}
        data={habits}
        keyExtractor={(it, i) => String(it.id ?? i)}
        ItemSeparatorComponent={() => <Divider style={{ opacity: 0 }} />}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Du hast derzeit noch keine Habits. Füge unten in der Navigation über „Neues Habit hinzufügen“ eins hinzu.
          </Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Bearbeiten-Dialog */}
      <Portal>
        <Dialog
          visible={!!editHabit}
          onDismiss={() => setEditHabit(null)}
        >
          <Dialog.Title>Habit bearbeiten</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Titel"
              value={editTitle}
              onChangeText={setEditTitle}
              mode="outlined"
            />
            <TextInput
              label="Beschreibung"
              value={editDescription}
              onChangeText={setEditDescription}
              mode="outlined"
              style={{ marginTop: 12 }}
              multiline
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditHabit(null)}>Abbrechen</Button>
            <Button onPress={handleSaveEdit}>Speichern</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

/** ---------- Styles ---------- */
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "white" },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxWidth: 900,
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
    maxWidth: 900,
    alignSelf: "center",
    width: "100%",
  },
  headerTitle: { fontWeight: "700" },

  weekHeader: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    maxWidth: 900,
    alignSelf: "center",
    width: "100%",
  },
  kwText: { fontWeight: "700", marginBottom: 8 },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  dayCol: { alignItems: "center", minWidth: 34 },
  dayNum: { fontSize: 16 },
  dayLabel: { fontSize: 12, opacity: 0.75, marginTop: 2 },
  bold: { fontWeight: "700" },
  todayText: { color: "palevioletred" },

  card: {
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: "#ececec",
  },

  row: { flexDirection: "row", gap: 12 },
  colLeft: { flex: 1 },
  colRight: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  title: { color: "#22223b", marginBottom: 4, fontWeight: "700" },
  description: { color: "#6c6c80" },

  counterRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  counterText: { fontWeight: "700", marginRight: 8, color: "#333" },
  dotsRow: { flexDirection: "row", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotFilled: { backgroundColor: "palevioletred" },
  dotEmpty: { backgroundColor: "#cfcfcf" },

  empty: { textAlign: "center", color: "#666", marginTop: 32 },
});