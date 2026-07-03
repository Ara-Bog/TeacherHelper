// Get categories for filter
export function getFilterCategories(tx, callback) {
  tx.executeSql(
    'SELECT id, name as label FROM Categories WHERE id > 0',
    [],
    (_, {rows}) => callback(rows.raw()),
    (_, err) => console.log('error getData (Categories) - ', err),
  );
}

// Get templates for filter
export function getFilterTemplates(tx, callback) {
  tx.executeSql(
    'SELECT id, name as label FROM Templates',
    [],
    (_, {rows}) => callback(rows.raw()),
    (_, err) => console.log('error getData (Templates) - ', err),
  );
}

// Get diagnoses for filter (grouped to avoid duplicates)
export function getFilterDiagnoses(tx, callback) {
  tx.executeSql(
    `
    SELECT MIN(id) as id, name as label
    FROM Diagnosis
    GROUP BY label
    ORDER BY id
    `,
    [],
    (_, {rows}) => callback(rows.raw()),
    (_, err) => console.log('error getData (Diagnosis) - ', err),
  );
}
