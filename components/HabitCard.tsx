import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { PropsWithChildren, useState } from "react";

type HabitCardProps = PropsWithChildren<{
  habitName: string;
  handleCompleteHabit: (habitName:string) => void;
}>;

const HabitCard = ({ habitName, handleCompleteHabit }: HabitCardProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const handlePress = () => {
    setIsChecked(!isChecked);
    handleCompleteHabit(habitName);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.habitText}>{habitName}</Text>
      <Pressable
        onPress={handlePress}
        style={[styles.checkbox, isChecked && styles.checkedCheckbox]}
      >
        {isChecked && <Text style={styles.checkmark}>✔</Text>}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F0F8FF", // AliceBlue
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    elevation: 3, // Adds a shadow for Android
    shadowColor: "#000", // Adds a shadow for iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  habitText: {
    fontSize: 18,
    color: "#000", // Black
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#FFD700", // Gold
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkedCheckbox: {
    backgroundColor: "#FFD700", // Gold
  },
  checkmark: {
    color: "#FFF", // White
    fontSize: 16,
  },
});

export default HabitCard;
