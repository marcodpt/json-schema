import upgrade from './upgrade.js'
import validation from './validation.js'
import applicator from './applicator.js'
import core from './core.js'
import {copy, isObj} from './lib.js'

export default (schema, data, onError) => {
  const root = copy(schema === undefined ? null : schema)
  const resolver = core(root)

  const validator = (schema, data) => {
    if (typeof schema === "boolean") {
      return schema
    }
    upgrade(schema)
    resolver(schema)
    const a = applicator(validator)
    const v = validation(schema)(data)
    if (v != "" && onError) {
      onError(v)
    }

    return v == "" &&
      Object.keys(a).reduce((pass, key) => {
        return pass && (
          schema[key] === undefined || a[key](schema[key], data, schema)
        )
      }, true)
  }
  return validator(root, data)
}
