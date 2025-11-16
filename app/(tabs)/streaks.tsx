import { addCompletion, getAllCompletions, getAllHabits } from "@/lib/database";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import {
  Card,
  Divider,
  IconButton,
  ProgressBar,
  Text,
} from "react-native-paper";

type Habit = {
  id?: number | string;
  title: string;
  description?: string;
  created_at: number;
};

type Completion = {
  id: number | string;
  habit_id: number | string;
  completed_at: number;
};

const MS_PER_DAY = 86_400_000;
const dayKey = (ms: number) => Math.floor(ms / MS_PER_DAY);

function startOfISOWeek(d: Date) {
  const x = new Date(d);
  const w = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - w);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isSameISOWeek(a: Date, b: Date) {
  return startOfISOWeek(a).getTime() === startOfISOWeek(b).getTime();
}

function weeklyTarget() {
  return 7; // tägliches Habit
}

function computeStatsForHabit(habit: Habit, allComps: Completion[]) {
  const comps = allComps
    .filter((c) => String(c.habit_id) === String(habit.id))
    .sort((a, b) => a.completed_at - b.completed_at);

  const total = comps.length;
  let last: number | undefined;
  let current = 0;
  let best = 0;

  for (const c of comps) {
    const dk = dayKey(c.completed_at);
    if (last === undefined || dk === last + 1) {
      current += 1;
    } else if (dk !== last) {
      current = 1;
    }
    best = Math.max(best, current);
    last = dk;
  }

  const now = new Date();
  const weekCount = comps.filter((c) =>
    isSameISOWeek(new Date(c.completed_at), now)
  ).length;
  const target = weeklyTarget();
  const weeklyProgress = Math.min(1, target ? weekCount / target : 0);

  return { total, streak: current, bestStreak: best, weekCount, target, weeklyProgress };
}

export default function StreaksScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const [h, c] = await Promise.all([getAllHabits(), getAllCompletions()]);
    setHabits(h ?? []);
    setCompletions(c ?? []);
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

    await addCompletion(habitId, Date.now());
    await load();
  };

  const rows = useMemo(
    () =>
      habits.map((h) => ({
        habit: h,
        stats: computeStatsForHabit(h, completions),
      })),
    [habits, completions]
  );

  const renderItem = ({ item }: { item: (typeof rows)[number] }) => {
    const { habit, stats } = item;
    return (
      <Card style={styles.card} mode="elevated">
        <Card.Content>
          <View style={styles.rowHeader}>
            <Text variant="titleMedium" style={styles.habitTitle}>
              {habit.title}
            </Text>
            <IconButton
              icon="check-circle-outline"
              size={20}
              onPress={() => completeToday(habit.id)}
              accessibilityLabel="Heute erledigt"
            />
          </View>

          {!!habit.description && (
            <Text style={styles.habitDescription}>{habit.description}</Text>
          )}

          <View style={styles.statsRow}>
            <View className="statBadge">
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>{stats.streak}</Text>
                <Text style={styles.statLabel}>Aktuell</Text>
              </View>
            </View>
            <View style={styles.statBadgeGold}>
              <Text style={styles.statBadgeText}>{stats.bestStreak}</Text>
              <Text style={styles.statLabel}>Bester Streak</Text>
            </View>
            <View style={styles.statBadgeGreen}>
              <Text style={styles.statBadgeText}>{stats.total}</Text>
              <Text style={styles.statLabel}>Gesamt</Text>
            </View>
          </View>

          <View style={{ marginTop: 8 }}>
            <Text style={styles.weekText}>
              Diese Woche: {stats.weekCount} / {stats.target}
            </Text>
            <ProgressBar progress={stats.weeklyProgress} color="palevioletred" />
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Meine Streaks
        </Text>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(it, i) => String(it.habit.id ?? i)}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Divider style={{ opacity: 0 }} />}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            Noch keine Habits – füge über „Habit“ unten eins hinzu.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "white" },
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
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },

  card: { marginVertical: 8, borderRadius: 16, backgroundColor: "#ececec" },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  habitTitle: { color: "#22223b", fontWeight: "700" },
  habitDescription: { color: "#6c6c80", marginTop: 4 },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 8,
  },
  statBadge: {
    backgroundColor: "#fff3e0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 70,
  },
  statBadgeGold: {
    backgroundColor: "#fffde7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 70,
  },
  statBadgeGreen: {
    backgroundColor: "#e8f5e9",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 70,
  },
  statBadgeText: { fontWeight: "bold", fontSize: 15, color: "#22223b" },
  statLabel: { fontSize: 11, color: "#888", marginTop: 2, fontWeight: "500" },
  weekText: { fontSize: 12, marginBottom: 6, color: "#666" },
  empty: { textAlign: "center", color: "#666", marginTop: 32 },
});
