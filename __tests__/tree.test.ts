import {Tree, leaf, key, root} from "../tree";
import { withDefault } from "../lens";

test(
    "Can Create Tree", 
    () => {
        let tree = 
            key.set(root(""), "myTree")
        console.log(tree);
    }
)
test(
    "Can Create Big Tree",
    () => {
        let myBigtree = 
          leaf
          .pipe(withDefault(root("")))
          .setMany(root)(root(""), ["hi", "there","bud"])
        console.log(myBigtree)
    }
)