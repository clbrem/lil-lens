import {
  Lens,
  bind, 
  start,
  field
  } from "../lens"
import {
    JsonObject, asObject,asString, asNumber

} from "../json"

type MyType= {
  first: string
  second: number
}

test("Can bind Functions", () => {
/*     let myLens = 
      start<JsonObject>().pipe(
        asObject,
        bind<{[key: string]: JsonObject}, MyType>({
            first: start<JsonObject>().pipe(
                asObject,field("first"),
                asString
                )
            second: start<JsonObject>().pipe(asObject, field("second"), asNumber)
        })
      ) */
})