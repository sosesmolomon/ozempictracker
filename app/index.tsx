import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import * as utils from "@/utils/Database";

import HabitCard from "../components/HabitCard";

const Page = () => {
  const db = useSQLiteContext();
  //   utils.addHabit(db, "habitTest");

  const [habits, setHabits] = useState<string[]>([]);

  const handleDB = async () => {

    const response = await utils.getHabits(db);
    console.log(response[0].date);
    console.log(typeof(response[0].date));
    return;
    //let obj:HabitObject = JSON.parse(response);


    // setHabits(response);
    const habitNames: string[] = [];
    for (const row in response) {
        console.log(row);
    }
    console.log("----------------------------------------------")
    //console.log(habits)
    //console.log(response);
    console.log("----------------------------------------------")
  };

  const handleCompleteHabit = (thisHabit: string) => {
    console.log("complete this habit: ", thisHabit);
    //set this habit as completed in the database
  };
  useEffect(() => {
    handleDB();
  }, []);

  return (
    <View>
      {habits?.map((habitName, key) => (
        <HabitCard
          habitName={habitName}
          handleCompleteHabit={handleCompleteHabit}
        />
      ))}
      <Text>{habits}</Text>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({});
