import {getDB} from '../connection';
import {insertInto} from '../sqlGenerator';

// Format raw symptom/value data into structured object
export function destructStudentCardData(data) {
  let newData = {};
  data.forEach(item => {
    newData[item.id_section] ??= {};

    let selectIndex =
      item.id_parent != null ? item.id_parent : item.id_symptom;
    let currentObject = newData[item.id_section][selectIndex];

    currentObject ??= {
      label: '',
      values: [],
      type: '',
    };

    if (item.id_parent != null) {
      currentObject.childrens ??= {};
      currentObject.childrens[item.id_symptom] ??= {
        label: item.symptom,
        type: item.typeSym,
        values: [],
      };
      currentObject.childrens[item.id_symptom].values.push({
        id: item.id_symptomsValue,
        label: item.value,
        type: item.typeVal,
      });
    } else {
      currentObject.label = item.symptom;
      currentObject.type = item.typeSym;
      if (item.typeSym != 'label') {
        currentObject.values.push({
          id: item.id_symptomsValue,
          label: item.value,
          type: item.typeVal,
        });
      }
    }
    newData[item.id_section][selectIndex] = currentObject;
  });

  return newData;
}

// Get sorted sections for a template
export function getSections(tx, templateId, callback) {
  tx.executeSql(
    `SELECT id, name, show_label, tab_name, footer FROM Sections WHERE id_template = ? ORDER BY "orderBy"`,
    [templateId],
    (_, {rows}) => callback(rows.raw()),
  );
}

// Get all symptom values with field types for a template
export function getSymptomsStructure(tx, templateId, callback, errCallback) {
  tx.executeSql(
    `
    SELECT sym.id_section, sym.id as id_symptom,
      symVal.id as id_symptomsValue, sym.id_parent,
      sym.symptom, symVal.value, sym.typeSym, type.name AS typeVal
    FROM (
      SELECT
        sym.id, sym.id_section, sym.name as symptom,
        sym.id_parent, type.name as typeSym
      FROM
        Sections as sect
      LEFT JOIN
        Symptoms as sym ON sym.id_section = sect.id
      LEFT JOIN
        TypesField as type ON sym.type = type.id
      WHERE
        sect.id_template = ? AND sym.id_section IS NOT NULL
      ORDER BY
        sect.orderBy, sym.id
      ) as sym
    LEFT JOIN
      SymptomsValues as symVal ON sym.id = symVal.id_symptom
    LEFT JOIN
      TypesField as type ON symVal.type = type.id
    `,
    [templateId],
    (_, {rows}) => callback(destructStudentCardData(rows.raw())),
    err => {
      console.log('error studentRepo get all symptoms', err);
      if (errCallback) errCallback(err);
    },
  );
}

// Get diagnoses for a template
export function getDiagnoses(tx, templateId, callback) {
  tx.executeSql(
    `SELECT id, name FROM Diagnosis WHERE id_template IS NULL OR id_template = ?`,
    [templateId],
    (_, {rows}) => callback(rows.raw()),
    err => console.log('error get Diagnosis', err),
  );
}

// Get categories
export function getCategories(tx, callback) {
  tx.executeSql(
    `SELECT * FROM Categories WHERE id <> 0`,
    [],
    (_, {rows}) => callback(rows.raw()),
    err => console.log('error get Categories', err),
  );
}

// Get all categories (including id=0)
export function getAllCategories(tx, callback) {
  tx.executeSql(
    `SELECT * FROM Categories`,
    [],
    (_, {rows}) => callback(rows.raw()),
    err => console.log('error get all Categories', err),
  );
}

// Get current symptoms for a student
export function getCurrentSymptoms(tx, studentId, callback) {
  tx.executeSql(
    `
    SELECT cur.id_symptomsValue as id, cur.id_symptom, cur.id_group
    FROM CurrentSymptoms as cur
    WHERE cur.id_student = ?
    `,
    [studentId],
    (_, {rows}) => {
      let data = rows.raw();
      let newData = {};
      data.forEach(item => {
        newData[item.id_symptom] ??= [];
        if (item.id_group === null) {
          newData[item.id_symptom].push(item.id);
        } else {
          newData[item.id_symptom][item.id_group - 1] ??= [];
          newData[item.id_symptom][item.id_group - 1].push(item.id);
        }
      });
      callback(newData);
    },
    err => console.log('error get cur symptoms', err),
  );
}

// Get student data by id
export function getStudentById(tx, studentId, callback) {
  tx.executeSql(
    `
    SELECT surname, name, midname,
        group_org, date_bd, note,
        id_diagnos as diagnos,
        id_category as category
    FROM Students
    WHERE id = ?
    `,
    [studentId],
    (_, {rows}) => callback(rows.raw()[0]),
    err => console.log('error get student', err),
  );
}

// Get parents for a student
export function getParents(tx, studentId, callback) {
  tx.executeSql(
    `SELECT id, name, type, phone FROM ParentsStudent WHERE id_student = ?`,
    [studentId],
    (_, {rows}) => {
      let data = rows.raw();
      let contacts = Object.assign(
        {},
        ...data.map((item, index) => ({[index + 1]: item})),
      );
      callback(contacts);
    },
    err => console.log('error get parents', err),
  );
}

// Get groups for a student
export function getStudentGroups(tx, studentId, callback) {
  tx.executeSql(
    `
    SELECT g.id, g.name
    FROM ListStudentsGroup as lsg
    LEFT JOIN Groups as g ON lsg.id_group = g.id
    WHERE lsg.id_student = ?
    `,
    [studentId],
    (_, {rows}) => callback(rows.raw()),
    err => console.log('error get ListStudentsGroup', err),
  );
}

// Create a new student, returns the new id
export async function createStudent(data, templateId) {
  const db = getDB();
  let studentData = {
    surname: data.surname,
    name: data.name,
    midname: data.midname || null,
    group_org: data.group_org || null,
    date_bd: data.date_bd || null,
    id_diagnos: data.diagnos,
    id_category: data.category,
    note: data.note || null,
    id_template: templateId,
  };
  return await insertInto([studentData], 'Students', true);
}

// Update an existing student
export async function updateStudent(data, studentId) {
  const db = getDB();
  await db.transaction(tx => {
    tx.executeSql(
      `
      UPDATE Students
      SET surname = ?, name = ?, midname = ?,
          group_org = ?, date_bd = ?,
          id_diagnos = ?, id_category = ?, note = ?
      WHERE id = ?
      `,
      [
        data.surname,
        data.name,
        data.midname || null,
        data.group_org || null,
        data.date_bd || null,
        data.diagnos,
        data.category,
        data.note || null,
        studentId,
      ],
      null,
      err => console.log('error updateStudent', err),
    );

    // Delete old parents
    tx.executeSql(
      'DELETE FROM ParentsStudent WHERE id_student = ?',
      [studentId],
      null,
      err => console.log('error delete parents', err),
    );

    // Delete old symptoms
    tx.executeSql(
      'DELETE FROM CurrentSymptoms WHERE id_student = ?',
      [studentId],
      null,
      err => console.log('error delete symptoms', err),
    );
  });
}

// Save contacts and symptoms for a student
export async function saveStudentRelatedData(studentId, contacts, symptoms) {
  // Save contacts
  await insertInto(
    Object.values(contacts).map(item =>
      Object.fromEntries([
        ['id_student', studentId],
        ...Object.entries(item).filter(el => el[0] != 'id'),
      ]),
    ),
    'ParentsStudent',
  );

  // Save symptoms
  let newData = [];
  for (let key of Object.keys(symptoms)) {
    for (let [index, item] of symptoms[key].entries()) {
      if (Array.isArray(item)) {
        let subData = [];
        item.forEach(subItem => {
          subData.push({
            id_symptomsValue: subItem,
            id_symptom: key,
            id_group: index + 1,
            id_student: studentId,
          });
        });
        await insertInto(subData, 'CurrentSymptoms');
        continue;
      }
      newData.push({
        id_symptomsValue: item,
        id_symptom: key,
        id_student: studentId,
      });
    }
  }
  await insertInto(newData, 'CurrentSymptoms');
}

// Delete a student and all related data
export async function deleteStudent(id) {
  const db = getDB();
  await db.transaction(tx => {
    tx.executeSql(
      "DELETE FROM Timetable WHERE id_client = ? AND type_client = 's'",
      [id],
    );
    tx.executeSql('DELETE FROM CurrentSymptoms WHERE id_student = ?', [id]);
    tx.executeSql('DELETE FROM ListStudentsGroup WHERE id_student = ?', [id]);
    tx.executeSql('DELETE FROM Students WHERE id = ?', [id]);
  });
}

// Get all students for list view
export function getStudentsList(tx, callback) {
  tx.executeSql(
    `SELECT st.id as ID, ct.name as LeftBot, ct.id as LeftBot_id,
            dg.name as RightBot, dg.id as RightBot_id,
            st.surname || ' ' || st.name || ' ' || COALESCE(st.midname, '') as LeftTop,
            tp.name as RightTop, tp.id as RightTop_id,
            tp.name as template, tp.id as id_template
    FROM Students as st
    LEFT JOIN Templates as tp ON st.id_template = tp.id
    LEFT JOIN Diagnosis as dg ON st.id_diagnos = dg.id
    LEFT JOIN Categories as ct ON st.id_category = ct.id`,
    [],
    (_, {rows}) => callback(rows.raw()),
    (_, err) => console.log('error getStudentsList - ', err),
  );
}
