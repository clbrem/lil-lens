import {Tree, leaf, key, root} from "../tree";
import { withDefault } from "../lens";

test(
    "Can Create Tree", 
    () => {
        let tree = 
            key.set(root(""), "myTree")        
    }
)
test(
    "Can Create Big Tree",
    () => {
        let myBigtree = 
          leaf
          .pipe(withDefault(root("")))
          .setMany(root)(root(""), ["hi", "there","bud"])        
    }
)