import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

export function ScenarioCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, gap: 8, borderRadius: 18, backgroundColor: "#F3F4F6" },
  title: { color: "#15171A", fontSize: 17, fontWeight: "700" },
  description: { color: "#5D6470", lineHeight: 19 },
  body: { gap: 10 },
});
