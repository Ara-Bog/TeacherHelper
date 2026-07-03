// Thin WebSQL-compatible layer over @op-engineering/op-sqlite.
//
// The whole app was written against the react-native-sqlite-storage (WebSQL)
// API: `db.transaction(tx => tx.executeSql(sql, params, success, error))` and
// `db.executeSql(sql, params)`. op-sqlite exposes a different, promise-based
// API. Rather than rewrite ~80 call sites across repositories/pages/actions,
// this adapter re-implements the small slice of the WebSQL surface the code
// actually uses (rows.raw(), rows.length, result.insertId) on top of op-sqlite.
//
// op-sqlite does all the real work — sqlite-storage is fully removed.

function wrapResult(qr) {
  const arr = (qr && qr.rows) || [];
  return {
    insertId: qr ? qr.insertId : undefined,
    rowsAffected: qr ? qr.rowsAffected : 0,
    rows: {
      raw: () => arr,
      item: index => arr[index],
      length: arr.length,
      _array: arr,
    },
  };
}

class WebSqlDatabase {
  constructor(opdb) {
    this._db = opdb;
  }

  // WebSQL-style single statement. Returns Promise<[resultSet]> like
  // sqlite-storage with enablePromise(true).
  async executeSql(sql, params = []) {
    const qr = await this._db.execute(sql, params);
    return [wrapResult(qr)];
  }

  // WebSQL-style transaction. The callback registers statements synchronously
  // via tx.executeSql; they then run atomically (BEGIN/COMMIT) in registration
  // order. Success callbacks may enqueue further statements (chained queries),
  // which are picked up by the index-based queue below.
  transaction(callback) {
    const db = this._db;
    const queue = [];
    const tx = {
      executeSql(sql, params = [], success, error) {
        queue.push({sql, params: params || [], success, error});
      },
    };

    // Collect the initial statements synchronously.
    try {
      callback(tx);
    } catch (e) {
      return Promise.reject(e);
    }

    return new Promise((resolve, reject) => {
      try {
        db.executeSync('BEGIN');
        let i = 0;
        while (i < queue.length) {
          const statement = queue[i++];
          try {
            const qr = db.executeSync(statement.sql, statement.params);
            if (statement.success) {
              statement.success(tx, wrapResult(qr));
            }
          } catch (err) {
            // WebSQL semantics: a handled error lets the transaction continue.
            if (statement.error) {
              statement.error(tx, err);
            } else {
              throw err;
            }
          }
        }
        db.executeSync('COMMIT');
        resolve();
      } catch (err) {
        try {
          db.executeSync('ROLLBACK');
        } catch (_) {
          // ignore rollback failure — original error is more useful
        }
        reject(err);
      }
    });
  }
}

export function wrapDatabase(opdb) {
  return new WebSqlDatabase(opdb);
}
