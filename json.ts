import { Lens } from "./lens"
export type JsonObject = 
    | null 
    | string     
    | number
    | boolean
    | Array<JsonObject>
    | {[key: string]: JsonObject}

const isNull =  (item: JsonObject) => item === null
const isString = (item: JsonObject) => typeof(item) === 'string'
const isNumber = (item: JsonObject) => typeof(item) === 'number'
const isBool = (item: JsonObject) => typeof(item) === 'boolean'
const isArray = (item: JsonObject) => Array.isArray(item)
const isObject = (item: JsonObject) => typeof(item) === 'object' && (! Array.isArray(item)) && item !== null

export const stringify = 
            new Lens(
                (input: JsonObject) => JSON.stringify(input),
                (_,output: string) => JSON.parse(output) as JsonObject
                )
export const parse = 
    new Lens(        
        (input: string) => JSON.parse(input) as JsonObject,
        (_, output: JsonObject) => JSON.stringify(output),
        )

export const asNull = 
    () => {
        return new Lens(
            (input: JsonObject ) =>  {
                if (input === null) {
                    return null
                } else {
                    return undefined
                }
            },
            (_, output) => 
              output
        )
    }
export const asBool =
    () => {
        return new Lens(
            (input: JsonObject ) =>  {
                if (typeof(input) === 'boolean' ) {
                    return input
                } else {
                    return undefined
                }
            },
            (_, output) => 
            output
        )
    }
export const field = 
    <T>(key: string) => {
        return new Lens(
            (input: JsonObject ) =>  {
                if (isObject(input)) {
                    return input[key]
                } else {
                    return undefined
                }
            },
            (_, output) => 
            output
        )
    }


    