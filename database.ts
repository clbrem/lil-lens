import { defaultArray, Lens, mapKey, withDefault } from "./lens";

type Row = { [key: string]: string | number };
type Table = Map<string | number, Row>;

const keyValue = <K, V>(key: K) =>
  new Lens<Map<K, V>, V>(
    (map) => map.get(key),
    (map, value) => map.set(key, value)
  );
const mapOrDefault = <K, V>() => Lens.From(withDefault(new Map<K, V>()));

export type Database = { [table: string]: Table };

export const row = (id: string | number) =>
  Lens.Create<Table>().pipe(keyValue(id));
export const table: (table: string) => Lens<Database, Table> = (
  table: string
) => Lens.Create<Database>().pipe(mapKey(table), mapOrDefault());
