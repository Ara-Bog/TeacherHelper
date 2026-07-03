import {getDB} from '../connection';
import {insertInto} from '../sqlGenerator';

// Get timetable entry by id with joined data
export function getTimetableById(tx, timetableId, callback) {
  tx.executeSql(
    `
    SELECT df.id, df.time_start, df.time_end, df.date, df.id_client,
          df.type_client, dg.name AS diagnos, ct.name AS category
    FROM (
      SELECT tt.*,
        CASE tt.type_client
          WHEN "s" THEN st.id_category
          WHEN "g" THEN gp.id_category
          ELSE NULL
        END AS id_category,
        CASE tt.type_client
          WHEN "s" THEN st.id_diagnos
          WHEN "g" THEN gp.id_diagnos
          ELSE NULL
        END AS id_diagnos
      FROM Timetable AS tt
      LEFT JOIN Students AS st ON tt.type_client = "s" AND tt.id_client = st.id
      LEFT JOIN Groups AS gp ON tt.type_client = "g" AND tt.id_client = gp.id
      WHERE tt.id = ?
    ) AS df
    LEFT JOIN Diagnosis AS dg ON dg.id = df.id_diagnos
    LEFT JOIN Categories AS ct ON ct.id = df.id_category
    `,
    [timetableId],
    (_, {rows}) => callback(rows.raw()[0]),
    err => console.log('error get timetable entry', err),
  );
}

// Get students list for timetable form
export function getStudentsForTimetable(tx, templateId, callback) {
  tx.executeSql(
    `
    SELECT st.id, st.surname || ' ' || st.name AS name, ct.name AS category, dg.name AS diagnos
    FROM Students AS st
    LEFT JOIN Diagnosis AS dg ON dg.id = st.id_diagnos
    LEFT JOIN Categories AS ct ON ct.id = st.id_category
    WHERE st.id_template = ?
    `,
    [templateId],
    (_, {rows}) => callback(rows.raw()),
    err => console.log('error timetable get students', err),
  );
}

// Get groups list for timetable form
export function getGroupsForTimetable(tx, templateId, callback) {
  tx.executeSql(
    `
    SELECT gp.id, gp.name, ct.name AS category, dg.name AS diagnos
    FROM Groups AS gp
    LEFT JOIN Diagnosis AS dg ON dg.id = gp.id_diagnos
    LEFT JOIN Categories AS ct ON ct.id = gp.id_diagnos
    WHERE gp.id_template = ?
    `,
    [templateId],
    (_, {rows}) => callback(rows.raw()),
    err => console.log('error timetable get groups', err),
  );
}

// Get all timetable entries with UNION query for students and groups
export function getTimetableList(tx, callback) {
  tx.executeSql(
    `
    SELECT df.ID, df.date, df.type_client, df.id_client,
        df.LeftBot, df.time_start || " - " || df.time_end AS LeftTop,
        ct.id as RightTop_id, ct.name AS RightTop,
        dg.id as RightBot_id, dg.name AS RightBot,
        tp.id as id_template, tp.name as template
    FROM (
      SELECT tt.id as ID, tt.time_start, tt.time_end, tt.date,
        tt.type_client, tt.id_client, st.name || ' ' || st.surname AS LeftBot,
        st.id_category, st.id_diagnos, st.id_template
      FROM Timetable AS tt
      LEFT JOIN Students AS st ON st.id = tt.id_client
      WHERE tt.type_client = "s"
      UNION
      SELECT tt.id AS id_note, tt.time_start, tt.time_end, tt.date,
        tt.type_client, tt.id_client AS id, gp.name AS LeftBot,
        gp.id_category, gp.id_diagnos, gp.id_template
      FROM Timetable AS tt
      LEFT JOIN Groups AS gp ON gp.id = tt.id_client
      WHERE tt.type_client = "g"
    ) AS df
    LEFT JOIN Diagnosis AS dg ON df.id_diagnos = dg.id
    LEFT JOIN Categories AS ct ON df.id_category = ct.id
    LEFT JOIN Templates AS tp ON tp.id = df.id_template
    ORDER BY LeftTop
    `,
    [],
    (_, {rows}) => callback(rows.raw()),
    err => console.log('error timetable get data', err),
  );
}

// Check for time overlap on given days
export async function checkTimeOverlap(days, timeStart, timeEnd, increaseTimeFn) {
  const db = getDB();
  let badDays = [];
  let newStart = increaseTimeFn(timeStart, 1);
  let newEnd = increaseTimeFn(timeEnd, -1);

  await db.transaction(tx => {
    days.forEach(day => {
      tx.executeSql(
        `SELECT *
        FROM Timetable
        WHERE
          date = ?
          AND (
              (? BETWEEN time_start AND time_end)
              OR (? BETWEEN time_start AND time_end)
              OR (
                  (time_start BETWEEN ? AND ?)
                  AND (time_end BETWEEN ? AND ?)
                  )
              )
          `,
        [day, newStart, newEnd, newStart, newEnd, newStart, newEnd],
        (_, {rows}) => (rows.length ? badDays.push(day) : null),
      );
    });
  });

  return badDays;
}

// Create a new timetable entry, returns the new id
export async function createTimetable(data) {
  let timetableData = {
    time_start: data.time_start || null,
    time_end: data.time_end || null,
    date: data.date || null,
    id_client: data.id_client || null,
    type_client: data.type_client || null,
    note: data.note || null,
  };
  return await insertInto([timetableData], 'Timetable', true);
}

// Update an existing timetable entry
export async function updateTimetable(data, timetableId) {
  const db = getDB();
  await db.transaction(tx => {
    tx.executeSql(
      `
      UPDATE Timetable
      SET time_start = ?, time_end = ?, date = ?,
          id_client = ?, type_client = ?, note = ?
      WHERE id = ?
      `,
      [
        data.time_start || null,
        data.time_end || null,
        data.date || null,
        data.id_client || null,
        data.type_client || null,
        data.note || null,
        timetableId,
      ],
      null,
      err => console.log('error updateTimetable', err),
    );
  });
}

// Insert timetable entries for multiple days
export async function insertMultipleDays(data, days) {
  for (let day of days) {
    let timetableData = {
      time_start: data.time_start || null,
      time_end: data.time_end || null,
      date: day || null,
      id_client: data.id_client || null,
      type_client: data.type_client || null,
      note: data.note || null,
    };
    await insertInto([timetableData], 'Timetable');
  }
}

// Delete a timetable entry
export async function deleteTimetable(id) {
  const db = getDB();
  await db.transaction(tx => {
    tx.executeSql('DELETE FROM Timetable WHERE id = ?', [id]);
  });
}
