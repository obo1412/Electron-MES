import { Mapper } from "../mapper/sqlMapper";
import * as dbConfig from "../config/dbconfig";
import * as Utils from "../utils/utils";

// get-all-data DB 통신 함수
export function getAllData(params) {
  const query = Mapper.SelectAll;
  return new Promise((resolve, reject) => {
    dbConfig.db.all(query, [], async (err, rows) => {
      if (err) {
        reject(console.error("사용자 조회 오류:", err.message));
        return;
      }

      let result = [];
      for (const row of rows) {
        const content2 = await Utils.bufferToString(row.content);
        const modiRow = {
          ...row,
          content: content2,
        };
        result.push(modiRow);
      }
      resolve(result);
    });
  });
}

// insert-data DB 통신 함수
export function addData(params) {
  const query = Mapper.InsertContent;
  return new Promise((resolve, reject) => {
    dbConfig.db.run(query, [params], function (err) {
      if (err) {
        reject(console.log(err.message));
      }
      resolve([this.changes, this.lastID]);
    });
  });
}

// db.all()은 결과 전체
// id로 저장된 데이터 불러오기
export function getOneData(params) {
  const query = Mapper.SelectOneById;
  return new Promise((resolve, reject) => {
    try {
      dbConfig.db.get(query, params, async (err, row) => {
        const content = await Utils.bufferToString(row.content);
        row = {
          ...row,
          content: content,
        };
        resolve(row);
      });
    } catch (error) {
      reject(error);
    }
  });
}
