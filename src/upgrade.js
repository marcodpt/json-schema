export default schema => {

  /*Draft: 3*/
  if (schema.type != null) {
    const X = schema.type instanceof Array ? schema.type : [schema.type]
    const T = X.filter(t => typeof t == "string")
    const S = X.filter(t => typeof t != "string")

    if (T.indexOf("any") !== -1 || S.length > 0) {
      delete schema.type

      if (T.indexOf("any") === -1 && S.length) {
        schema.anyOf = schema.anyOf || []
        if (T.length) {
          schema.anyOf.push({type: T})
        }
        S.forEach(s => {
          schema.anyOf.push(s)
        })
      }
    }
  }

  if (schema.properties != null) {
    const R = []
    const P = schema.properties
    Object.keys(P).forEach(key => {
      if (typeof P[key].required == "boolean") {
        if (P[key].required) {
          R.push(key)
        }
        delete P[key].required
      }
    })
    if (R.length) {
      if (schema.required == null) {
        schema.required = []
      }
      R.forEach(key => {
        if (schema.required.indexOf(key) == -1) {
          schema.required.push(key)
        }
      })
    }
  }

  if (schema.divisibleBy != null) {
    schema.multipleOf = schema.divisibleBy
    delete schema.divisibleBy
  }

  /*Draft: 3,4*/
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

  /*Draft: 3,4,6,7*/
  if (schema.dependencies != null) {
    const D = schema.dependencies
    const S = {}
    const R = {}

    Object.keys(D).forEach(key => {
      if (typeof D[key] == "string" || (D[key] instanceof Array)) {
        R[key] = typeof D[key] == "string" ? [D[key]] : D[key]
      } else if (D[key] != null) {
        S[key] = D[key]
      }
    })

    if (Object.keys(R).length) {
      if (schema.dependentRequired == null) {
        schema.dependentRequired = {}
      }
      const P = schema.dependentRequired
      Object.keys(R).forEach(key => {
        if (P[key] == null) {
          P[key] = []
        }
        R[key].forEach(dep => {
          if (P[key].indexOf(dep) == -1) {
            P[key].push(dep)
          }
        })
      })
    }

    if (Object.keys(S).length) {
      if (schema.dependentSchemas == null) {
        schema.dependentSchemas = {}
      }
      const P = schema.dependentSchemas
      Object.keys(S).forEach(key => {
        if (P[key] == null) {
          P[key] = S[key]
        } else {
          P[key] = {allOf: [P[key], S[key]]}
        }
      })
    }

    delete schema.dependencies
  }

  /*Draft: 3,4,6,7,2019-09*/
  if (schema.items instanceof Array) {
    if (schema.prefixItems == null) {
      schema.prefixItems = schema.items
    }
    delete schema.items
  }

  if (schema.additionalItems != null) {
    if (schema.items == null && schema.prefixItems != null) {
      schema.items = schema.additionalItems
    }
    delete schema.additionalItems
  }
}
