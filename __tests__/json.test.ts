import {asObject} from "../json"
import {field} from "../lens"
test("Can work with JSON",() => {
    let myLens = asObject.pipe(field("myVal"))
    let v = myLens.set({}, 1)
    expect(myLens.view(v)).toBe(1)
    console.log(v)
}
)