export const Mapper = {
  SelectAll: `SELECT * FROM datalog`,
  InsertContent: `INSERT INTO datalog ( content ) VALUES ( ? )`,
  SelectOneById: `SELECT * FROM datalog WHERE id = $id`,
};
