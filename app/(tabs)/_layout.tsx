import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return  (
    // Tab-Navigation
    <Tabs screenOptions={{
      headerStyle: { backgroundColor: "whitesmoke"},
      headerShadowVisible: false,
      tabBarStyle: {
        backgroundColor: "whitesmoke",
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        },
        tabBarActiveTintColor: "palevioletred", // Farben React Native: https://reactnative.dev/docs/colors
        tabBarInactiveTintColor: "dimgrey",
      }}
      >

      {/* Tab für die Übersicht (Startscreen) */}
      <Tabs.Screen
      name="index"
      options={{
        title: "Übersicht",
        tabBarIcon: ({color, size}) => (
      <Ionicons name="calendar-outline" size={size} color={color} />
      ),
    }}
    />
      {/* Tab für das Formular Neues Habit hinzufügen */}
      <Tabs.Screen
      name="add-habit"
      options={{
        title: "Neues Habit hinzufügen",
        tabBarIcon: ({color, size}) => (
        <MaterialCommunityIcons
        name="plus"
        size={size}
        color={color}
        />
      ),
    }}
    />
      {/* Tab für Streaks */}
      <Tabs.Screen
      name="streaks"
      options={{
        title: "Streaks",
        tabBarIcon: ({color, size}) => (
        <MaterialCommunityIcons
        name="chart-line-variant"
        size={size}
        color={color}
        />
        ),
      }}
    />
    </Tabs>
  );
}

