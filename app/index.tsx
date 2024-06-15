import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSQLiteContext } from "expo-sqlite";
import * as utils from "@/utils/Database";

const Page = () => {
  const db = useSQLiteContext();
  //   utils.addHabit(db, "habitTest");

  const handleDB = async () => {
    //await utils.dropTables(db);
    const response2 = await utils.getHabits(db);
    console.log("2: ", response2);
    //await utils.sampleQueries(db);

  };

  handleDB();


  return (
    <View>
      <Text>Page</Text>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({});
