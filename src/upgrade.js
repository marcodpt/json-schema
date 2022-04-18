export default schema => {
  if (typeof schema.exclusiveMinimum == "boolean") {
    if (schema.minimum != null && schema.exclusiveMinimum) {
      schema.exclusiveMinimum = schema.minimum
      delete schema.minimum
    } else {
      delete schema.exclusiveMinimum
    }
  }

  if (typeof schema.exclusiveMaximum == "boolean") {
    if (schema.maximum != null && schema.exclusiveMaximum) {
      schema.exclusiveMaximum = schema.maximum
      delete schema.maximum
    } else {
      delete schema.exclusiveMaximum
    }
  }

  if (schema.dependencies != null) {
    if (schema.dependentRequired == null) {
      const D = schema.dependencies
      schema.dependentRequired = Object.keys(D).reduce((R, key) => {
        R[key] = D[key] instanceof Array ? D[key] : [D[key]]
        return R
      }, {})
    }
    delete schema.dependencies
  }
}
