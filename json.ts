import { Lens, field } from "./lens";
export type JsonObject =
  | null
  | string
  | number
  | boolean
  | Array<JsonObject>
  | { [key: string]: JsonObject };

export const stringify = new Lens(
  (input: JsonObject) => JSON.stringify(input),
  (_, output: string) => JSON.parse(output) as JsonObject
);
export const parse = new Lens(
  (input: string) => JSON.parse(input) as JsonObject,
  (_, output: JsonObject) => JSON.stringify(output)
);

export const asNull = new Lens<JsonObject, null>(
  (_) => null,
  (_, __) => null
);

export const asBool: Lens<JsonObject, null | boolean> = new Lens(
  (input: JsonObject) => {
    if (typeof input === "boolean") {
      return input;
    } else {
      return null;
    }
  },
  (_, output) => output
);

export const asObject: Lens<JsonObject, null | { [key: string]: JsonObject }> =
  new Lens(
    (input: JsonObject) => {
      if (typeof input == "object" && !Array.isArray(input)) {
        return input;
      } else {
        return null;
      }
    },
    (_, item) => item
  );

export const asArray: Lens<JsonObject, null | Array<JsonObject>> = new Lens(
  (input: JsonObject) => {
    if (Array.isArray(input)) {
      return input;
    } else {
      return null;
    }
  },
  (_, item) => item
);
export const asString: Lens<JsonObject, null | string> = new Lens(
  (input: JsonObject) => {
    if (typeof input === "string") {
      return input;
    } else {
      return null;
    }
  },
  (_, item) => item
);
export const objectKey: (
  name: string
) => Lens<{[key: string]: JsonObject},JsonObject> = (name: string) =>
  field<{ [key: string]: JsonObject }, string>(name);

export const asNumber: Lens<JsonObject, null | number> = new Lens(
  (input: JsonObject) => {
    if (typeof input === "number") {
      return input;
    } else {
      return null;
    }
  },
  (_, item) => item
);
