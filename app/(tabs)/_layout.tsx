import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return  (
    <Tabs screenOptions={{
      headerStyle: { backgroundColor: "whitesmoke"},
      headerShadowVisible: false,
      tabBarStyle: {
        backgroundColor: "#whitesmoke",
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        },
        tabBarActiveTintColor: "palevioletred", // Farben React Native: https://reactnative.dev/docs/colors
        tabBarInactiveTintColor: "dimgrey",
      }}
      >
      <Tabs.Screen
      name="index"
      options={{
        title: "Habit Tracker",
        tabBarIcon: ({color, size}) => (
      <Ionicons name="calendar-outline" size={size} color={color} />
      ),
    }}
    />
        <Tabs.Screen
      name="add-habit"
      options={{
        title: "Habit Tracker",
        tabBarIcon: ({color, size}) => (
        <MaterialCommunityIcons
        name="plus"
        size={size}
        color={color}
        />
      ),
    }}
    />
      <Tabs.Screen
      name="streaks"
      options={{
        title: "Habit Tracker",
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

