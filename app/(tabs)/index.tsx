import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.view}
    >
      <Text>Willkommen, Test Text</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
})