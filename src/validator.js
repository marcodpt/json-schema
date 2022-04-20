import upgrade from './upgrade.js'
import validation from './validation.js'
import applicator from './applicator.js'
import it from './iterator.js'
import core from './core.js'
import {copy, isObj} from './lib.js'

export default (schema, data) => {
  const root = copy(schema === undefined ? null : schema)
  const resolver = core(root)

  if (typeof data == "function") {
    const iterator = (schema, path) => {
      upgrade(schema)
      resolver(schema)
      if (isObj(schema)) {
        data(schema, path, validation(schema))
        it(iterator, schema, path)
      }
    }
    return iterator(root, '#')
  } else {
    const validator = (schema, data) => {
      if (typeof schema === "boolean") {
        return schema
      }
      upgrade(schema)
      resolver(schema)
      const a = applicator(validator)

      return validation(schema)(data) == "" &&
        Object.keys(a).reduce((pass, key) => {
          return pass && (
            schema[key] === undefined || a[key](schema[key], data, schema)
          )
        }, true)
    }
    return validator(root, data)
  }
}
