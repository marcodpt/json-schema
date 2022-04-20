const it = iterator => ({
  prefixItems: (schema, path) => schema.forEach(
    (item, i) => iterator(item, `${path}/${i}`)
  ),
  items: (schema, path) => iterator(schema, path),
  properties: (schema, path) => Object.keys(schema).forEach(
    key => iterator(schema[key], `${path}/${key}`)
  ),
  additionalProperties: (schema, path) => iterator(schema, path)
})

export default (iterator, schema, path) => {
  const F = it(iterator)
  Object.keys(F).forEach(key => {
    if (schema[key] != null) {
      F[key](schema[key], `${path}/${key}`)
    }
  })
}
