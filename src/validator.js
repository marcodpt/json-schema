import upgrade from './upgrade.js'
import validation from './validation.js'
import applicator from './applicator.js'
import resolver from './core.js'
import {copy} from './lib.js'

export default (schema, data) => {
  const root = copy(schema)

  const validator = (schema, data) => {
    if (typeof schema === "boolean") {
      return schema
    }
    upgrade(schema)
    const a = applicator(validator)

    return Object.keys(validation).reduce((pass, key) => pass && (
      schema[key] === undefined || validation[key](schema[key], data)
    ), schema ? true : false) && Object.keys(a).reduce((pass, key) => 
      pass && (schema[key] === undefined || a[key](schema[key], data, schema))
    , true)
  }

  return validator(root, data)
}
