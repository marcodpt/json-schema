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

const resolver = (root, schema) => {
  if (schema.$ref != null) {
    const data = resolve(root, schema.$ref)
    delete schema.$ref
    Object.keys(data).forEach(key => {
      if (schema[key] === undefined) {
        schema[key] = data[key]
      }
    })

    resolver(root, schema)
  }
}

export default resolver
