import upgrade from './upgrade.js'

const resolve = (root, path) => typeof path != "string" ? {} :
  path.split('/').reduce((p, key) => {
    if (key == '#') {
      return root
    } else if (p != null && typeof p[key] == "object") {
      return p[key]
    } else {
      return {}
    }
  }, {})

export default root => {
  const resolver = schema => {
    if (schema == null || typeof schema != "object") {
      return
    }
    if (schema.$ref != null) {
      const data = resolve(root, schema.$ref)
      upgrade(data)
      delete schema.$ref
      Object.keys(data).forEach(key => {
        if (schema[key] === undefined) {
          schema[key] = data[key]
        }
      })

      resolver(schema)
    }
  }

  return resolver
}
