import upgrade from './upgrade.js'
import keywords from './keywords.js'

export default (schema, data) => typeof schema === "boolean" ? schema :
  Object.keys(keywords).reduce((pass, keyword) => {
    upgrade(schema)
    const s = schema[keyword]
    const v = keywords[keyword]

    return pass && (s === undefined || v(s, data, schema))
  }, schema ? true : false)
