import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return  (
    <Tabs screenOptions={{tabBarActiveTintColor: "coral" }}>
      <Tabs.Screen name="index" options={{ title: "Überblick",
      tabBarIcon: ({color}) => (
      <Ionicons name="calendar-outline" size={24} color={color} />
      ),
    }}
    />
      <Tabs.Screen name="login" options={{ title: "Login" }} />
    </Tabs>
  );
}