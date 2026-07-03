import {getDB} from '../connection';
import {insertInto} from '../sqlGenerator';

// Get group members (students in the group)
export function getGroupMembers(tx, groupId, callback) {
  tx.executeSql(
    `
    SELECT st.id,
      st.surname || ' ' || st.name || ' ' || COALESCE(st.midname, '') as name
    FROM ListStudentsGroup as lsg
    LEFT JOIN Students as st ON st.id = lsg.id_student
    WHERE id_group = ?
    `,
    [groupId],
    (_, {rows}) => callback(rows.raw()),
    err => console.log('error get group members', err),
  );
}

// Get group data by id
export function getGroupById(tx, groupId, callback) {
  tx.executeSql(
    `
    SELECT name,
      id_diagnos as diagnos,
      id_category as category
    FROM Groups
    WHERE id = ?
    `,
    [groupId],
    (_, {rows}) => callback(rows.raw()[0]),
    err => console.log('error get group', err),
  );
}

// Create a new group, returns the new id
export async function createGroup(data, templateId) {
  let groupData = {
    name: data.name,
    id_diagnos: data.diagnos,
    id_category: data.category,
    id_template: templateId,
  };
  return await insertInto([groupData], 'Groups', true);
}

// Update an existing group
export async function updateGroup(data, groupId) {
  const db = getDB();
  await db.transaction(tx => {
    tx.executeSql(
      `
      UPDATE Groups
      SET name = ?, id_diagnos = ?, id_category = ?
      WHERE id = ?
      `,
      [data.name, data.diagnos, data.category, groupId],
      null,
      err => console.log('error updateGroup', err),
    );

    // Delete old group-student links
    tx.executeSql(
      'DELETE FROM ListStudentsGroup WHERE id_group = ?',
      [groupId],
      null,
      err => console.log('error delete ListStudentsGroup', err),
    );
  });
}

// Save group members (student links)
export async function saveGroupMembers(groupId, members) {
  await insertInto(
    members.map(item => ({id_group: groupId, id_student: item.id})),
    'ListStudentsGroup',
  );
}

// Delete a group and all related data
export async function deleteGroup(id) {
  const db = getDB();
  await db.transaction(tx => {
    tx.executeSql(
      "DELETE FROM Timetable WHERE id_client = ? AND type_client = 'g'",
      [id],
    );
    tx.executeSql('DELETE FROM ListStudentsGroup WHERE id_group = ?', [id]);
    tx.executeSql('DELETE FROM Groups WHERE id = ?', [id]);
  });
}

// Get all groups for list view
export function getGroupsList(tx, callback) {
  tx.executeSql(
    `SELECT gt.id as ID, ct.name as LeftBot, ct.id as LeftBot_id,
            dg.name as RightBot, dg.id as RightBot_id,
            tp.name as template, tp.id as id_template,
            tp.name as RightTop, tp.id as RightTop_id,
            gt.name as LeftTop
    FROM Groups as gt
    LEFT JOIN Templates as tp ON gt.id_template = tp.id
    LEFT JOIN Diagnosis as dg ON gt.id_diagnos = dg.id
    LEFT JOIN Categories as ct ON gt.id_category = ct.id`,
    [],
    (_, {rows}) => callback(rows.raw()),
    (_, err) => console.log('error getGroupsList - ', err),
  );
}
