import { start, Lens,field } from "./lens"

export type Tree = {
    key: string
    leaf: Tree | undefined
}
const isLeaf = (tree: Tree) => typeof(tree.leaf) === "undefined"

export const root : (key: string) => Tree = (key: string)  =>
({
    key,
    leaf: undefined
})



export const key = start<Tree>().pipe(field("key"))

export const leaf = start<Tree>().pipe(field("leaf"))


const search  = (acc: Tree [], tree:Tree) => {
    
}
