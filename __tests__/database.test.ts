import { bulk, row, table, Database } from "../database"
import { start, field } from "../lens"

test("Can create database", () => {
  let context = start<Database>()
  let MyTable = context.pipe(table("MyTable"));
  let MyOtherTable = context.pipe(table("MyOtherTable"));
  let db: Database = {};

  db = MyTable.pipe(bulk).set(db, [
    [1, { hi: "there" }],
    [2, { hi: "bye" }],
  ]);

  db = MyOtherTable.pipe(row("Row1")).set(db, { myTableId: 1 });

  
  expect(MyTable.pipe(row(1), field("hi")).view(db)).toEqual("there");
  expect(MyOtherTable.pipe(row("Row1"), field("myTableId")).view(db)).toEqual(
    1
  );
});
