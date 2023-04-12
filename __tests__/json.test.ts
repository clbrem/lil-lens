import { start, field, bind, pushPeek, Lens, identity } from "../lens";
import { JsonObject, asArray, asObject, asString, objectKey } from "../json";
test("Can work with JSON", () => {
  let a = start<JsonObject>().pipe(
    asObject,
    bind({
      hi: objectKey("hi").pipe(asObject, objectKey("bye")),
      bye: objectKey("bye").pipe(asArray, pushPeek(), asString)
    })
  );

  let testVal = { hi: { bye: "bye bye" }, bye: ["hi", "bye"] };
  console.log(a.view(testVal));
  expect(a.view(testVal)).toEqual({ hi: "bye bye", bye: "bye" });
});

test("Can bind", () => {});
