import { SQLiteDatabase } from "expo-sqlite/next";
import * as FileSystem from "expo-file-system";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  // once per connection
  console.log(FileSystem.documentDirectory);

  const DATABASE_VERSION = 1;
  let result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  let currentDbVersion = result?.user_version ?? 0;

  //   let currentDbVersion = 0;

  //   if (currentDbVersion >= DATABASE_VERSION) {
  //     console.log("ON LATEST DB VERSION");
  //     return;
  //   }
  //   if (currentDbVersion === 0) {
  //     console.log("CREATING TABLES");
  //     createTables(db);
  //     currentDbVersion = 1;
  //   }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }

  await dropTables(db);
  await createTables(db);
  await insertSampleData(db);
  //await sampleQueries(db);

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

/*
const createTables = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        PRAGMA journal_mode = WAL;
        `);

  await db.execAsync(`
        CREATE TABLE IF NOT EXISTS habits (
          id INTEGER PRIMARY KEY NOT NULL, 
          name TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS weeks (
            id INTEGER PRIMARY KEY,
            year INTEGER NOT NULL,
            week_number INTEGER NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            UNIQUE(year, week_number)
          );
          
          CREATE TABLE IF NOT EXISTS habittracking (
            id INTEGER PRIMARY KEY NOT NULL,
            habits_id INTEGER,
            weeks_id INTEGER,
            FOREIGN KEY (habits_id) REFERENCES habits(id),
            FOREIGN KEY (weeks_id) REFERENCES weeks(id)
          );
          
        CREATE TABLE IF NOT EXISTS weeklycompleted (
            id INTEGER PRIMARY KEY NOT NULL,
            habit_tracking_id INTEGER,
            date DATE NOT NULL,
            completed BOOLEAN NOT NULL,
            FOREIGN KEY (habit_tracking_id) REFERENCES habittracking(id)
            );
        `);
};
export const insertSampleData = async (db: SQLiteDatabase) => {
  await db.execAsync(`
          INSERT INTO habits (id, name) VALUES 
          (1, 'running'),
          (2, 'reading'),
          (3, 'meditation');
  
          INSERT INTO weeks (id, year, week_number, start_date, end_date) VALUES 
          (1, 2024, 1, '2024-01-01', '2024-01-07'),
          (2, 2024, 2, '2024-01-08', '2024-01-14'),
          (3, 2024, 3, '2024-01-15', '2024-01-21');
  
          INSERT INTO habittracking (id, habits_id, weeks_id) VALUES 
          (1, 1, 1), -- Running in Week 1
          (2, 1, 2), -- Running in Week 2
          (3, 2, 1), -- Reading in Week 1
          (4, 3, 3); -- Meditation in Week 3
  
          INSERT INTO weeklycompleted (id, habit_tracking_id, date, completed) VALUES 
          (1, 1, '2024-01-01', TRUE),  -- Running on 2024-01-01
          (2, 1, '2024-01-03', TRUE),  -- Running on 2024-01-03
          (3, 2, '2024-01-10', FALSE), -- Running on 2024-01-10
          (4, 3, '2024-01-05', TRUE),  -- Reading on 2024-01-05
          (5, 4, '2024-01-16', TRUE);  -- Meditation on 2024-01-16
          `);
};
*/

const createTables = async (db: SQLiteDatabase) => {
  await db.execAsync(`
          PRAGMA journal_mode = WAL;
          `);

  await db.execAsync(`
          CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY NOT NULL, 
            name TEXT NOT NULL,
            units TEXT
          );
          
          CREATE TABLE IF NOT EXISTS daily (
              id INTEGER PRIMARY KEY,
              habits_id INTEGER NOT NULL,
              date TEXT NOT NULL,
              completed BOOLEAN,
              count INTEGER,
              FOREIGN KEY (habits_id) REFERENCES habits(id)
            );
          `);
};

export const insertSampleData = async (db: SQLiteDatabase) => {
  await db.execAsync(`
        INSERT INTO habits (id, name, units) VALUES 
        (1, 'vegetables', 'count'),
        (2, 'fruits', 'count'),
        (3, 'yogurts', 'count'),
        (4, 'nuts', 'count'),
        (5, 'protein', 'count'),
        (6, 'exercise', 'intensity');

        INSERT INTO daily (id, habits_id, date, completed, count) VALUES
        (1, 1, date("2024-06-22"), False, 0),
        (2, 1, date("2024-06-21"), TRUE, 4),
        (3, 1, date("2024-06-20"), TRUE, 4),
        (4, 1, date("2024-06-19"), TRUE, 4),
        (5, 6, date("2024-06-22"), FALSE, 0),
        (6, 6, date("2024-06-21"), TRUE, 8),
        (7, 6, date("2024-06-20"), TRUE, 7),
        (8, 6, date("2024-06-19"), TRUE, 5),
        (9, 6, date("2024-06-18"), TRUE, 5),
        (10, 6,date("2024-06-17"), FALSE, 0),
        (11, 6,date("2024-06-16"), FALSE, 0),
        (12, 6,date("2024-06-15"), TRUE, 5);
        `);
};

export const dropTables = async (db: SQLiteDatabase) => {
  const response = await db.execAsync(`
        DROP TABLE IF EXISTS habits;
        DROP TABLE IF EXISTS habittracking;
        DROP TABLE IF EXISTS weeks;
        DROP TABLE IF EXISTS daily;
        DROP TABLE IF EXISTS weeklycompleted;
        DROP TABLE IF EXISTS todos;
        `);
};

// const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const sampleQueries = async (db: SQLiteDatabase) => {
  const response: Array<any> = await db.getAllAsync(`
        SELECT 
    habits.name AS habit_name,
    weeks.year,
    weeks.week_number,
    weeks.start_date,
    weeks.end_date,
    weeklycompleted.date AS completed_date,
    weeklycompleted.completed
FROM 
    habits
INNER JOIN 
    habittracking ON habits.id = habittracking.habits_id
INNER JOIN 
    weeks ON habittracking.weeks_id = weeks.id
INNER JOIN 
    weeklycompleted ON habittracking.id = weeklycompleted.habit_tracking_id
ORDER BY 
    weeklycompleted.date;
`);
  console.log("query output: \n", response[0].start_date);
};

export const addHabit = async (db: SQLiteDatabase, name: string) => {
  const response = await db.runAsync(
    "INSERT INTO habits (name) VALUES (?)",
    name
  );
};

interface HabitObject{
    completed: number;
    count: number;
    date: Date;
    name: string;
    units: string;
};

export const getHabits = async (db: SQLiteDatabase) => {
  const allRows:HabitObject[] = await db.getAllAsync(`
    SELECT
        name, units, date, completed, count
    FROM 
        habits
    INNER JOIN
        daily ON habits.id=daily.habits_id
    ORDER BY
        daily.date `);

  //console.log(await db.getFirstAsync("SELECT date FROM daily"));

  console.log(typeof(allRows));
  console.log("----------------------------------------------")

//   const habits:Object = [];

//   let counter = 0;
//   for (const row of allRows) {
//     habits[counter] = row;
//     counter++;
//   }

  return allRows;
};

export const tableStructure = async (db: SQLiteDatabase) => {
  console.log(await db.runAsync(".tables"));
};

/**
 * Function to retrieve a habits weekly tracking record
 * i.e.
 * Habit: Running
 * today = 2024-06-
 *
 * @param db
 * @returns
 */
export const getWeeklyCompleted = async (db: SQLiteDatabase) => {
  return;
};

/*
#TODO
0. Constants
    Choose constants for colors and basic styling across app (online tool for stylesheet creation)

1. Create today page: 
    Key query functions:

    List all habits
    * Update completed on X date and refresh away

2. Create weekly tracking page
    list each habit and bubbles for each of the last 7 days. End of the list = today, first of list = today - 7
    
    function:
        click on habit tracking -> full calendar view? (maybe this comes a lot later)

3. Reflection area? 
    * basic forms

4. 









*/
