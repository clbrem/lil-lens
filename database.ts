import { field, Lens, withDefault } from "./lens";

export type Row = { [key: string]: string | number };
export type Table = Map<string | number, Row>;

export const bulk = new Lens<Table, [string | number, Row][]>(
  (table: Table) => [...table.entries()],
  (_store, entries) => new Map(entries)
);

const keyValue = <K, V>(key: K) =>
  new Lens<Map<K, V>, V>(
    (map) => map.get(key),
    (map, value) => map.set(key, value)
  );

export const row = (id: string | number) =>
  Lens.Create<Table>().pipe(keyValue(id));

export type Database = { [table: string]: Table };

export const table: (table: string) => Lens<Database, Table> = (
  table: string
) => Lens.Create<Database>().pipe(field(table), withDefault(new Map()));
