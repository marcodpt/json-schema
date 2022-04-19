import validator from './validator.js'

const eq = (X, Y) => {
  if (X && typeof X == "object" && Y && typeof Y == "object") {
    return Object.keys(X)
      .concat(Object.keys(Y))
      .reduce((pass, k) => pass && eq(X[k], Y[k]), true)
  } else {
    return X === Y
  }
}

const isObj = X => X != null && typeof X == 'object' && !(X instanceof Array)

export default {
  /*validation*/
  type: (schema, data) => 
    (typeof schema == "string" ? [schema] : schema).reduce((pass, type) =>
      pass ||
      (type === "null" && data === null) ||
      (type === "boolean" && (data === true || data === false)) ||
      (type === "number" && typeof data == "number") || (
        type === "integer" &&
        typeof data == "number" &&
        Number.isInteger(data)
      ) || (type === "string" && typeof data == "string") ||
      (type === "object" && isObj(data)) ||
      (type === "array" && data instanceof Array)
    , false),
  const: (schema, data) => eq(schema, data),
  enum: (schema, data) => schema.reduce(
    (contain, item) => contain || eq(item, data),
    false
  ),
  multipleOf: (schema, data) =>
    typeof data != 'number' ||
    Math.abs(data - schema * Math.round(data / schema)) / schema <= 0.000001,
  maximum: (schema, data) =>
    typeof data != 'number' || data <= schema,
  exclusiveMaximum: (schema, data) =>
    typeof data != 'number' || data < schema,
  minimum: (schema, data) =>
    typeof data != 'number' || data >= schema,
  exclusiveMinimum: (schema, data) =>
    typeof data != 'number' || data > schema,
  maxLength: (schema, data) => 
    typeof data != 'string' ||
    [...data].length <= schema,
  minLength: (schema, data) =>
    typeof data != 'string' ||
    [...data].length >= schema,
  pattern: (schema, data) =>
    typeof data != 'string' ||
    new RegExp(schema).test(data),
  maxItems: (schema, data) =>
    !(data instanceof Array) ||
    data.length <= schema,
  minItems: (schema, data) =>
    !(data instanceof Array) ||
    data.length >= schema,
  uniqueItems: (schema, data) =>
    !(data instanceof Array) || !schema ||
    data.reduce(
      (unique, x, i) => data.reduce(
        (unique, y, j) => unique && (j <= i || !eq(x, y))
      , unique)
    , true),
  maxProperties: (schema, data) =>
    !isObj(data) || Object.keys(data).length <= schema,
  minProperties: (schema, data) =>
    !isObj(data) || Object.keys(data).length >= schema,
  required: (schema, data) =>
    !isObj(data) ||
    schema.reduce((pass, key) => pass && data[key] !== undefined, true),
  dependentRequired: (schema, data) => {
    if (!isObj(data)) {
      return true
    }
    const Keys = Object.keys(data)

    return Object.keys(schema).reduce((pass, key) => pass && (
      Keys.indexOf(key) == -1 || schema[key].reduce(
        (pass, dep) => pass && Keys.indexOf(dep) != -1
      , true)
    ), true)
  },

  /*applicator*/
  prefixItems: (schema, data) => !(data instanceof Array) || schema.reduce(
    (pass, item, i) => pass && (
      data[i] === undefined ||
      validator(item, data[i])
    )
  , true),
  items: (schema, data, parent) => {
    if (!(data instanceof Array)) {
      return true
    }

    const n = parent.prefixItems != null ? parent.prefixItems.length : 0
    return data.reduce(
      (pass, item, i) => pass && (n > i || validator(schema, item))
    , true)
  },
  contains: (schema, data, parent) => {
    if (!(data instanceof Array)) {
      return true
    }
    const n = data.reduce(
      (n, item, i) => n + (validator(schema, item) ? 1 : 0)
    , 0)
    const max = parent.maxContains
    const min = parent.minContains

    return (typeof max != "number" || n <= max) &&
      (typeof min != "number" ? (n > 0) : (n >= min))
  },
  additionalProperties: (schema, data, parent) =>
    !isObj(data) || Object.keys(data).reduce((pass, key) => pass && ((
      parent.properties != null && 
      parent.properties[key] != null
    ) || (
      parent.patternProperties != null && 
      Object.keys(parent.patternProperties)
        .reduce((pass, regex) => pass || (new RegExp(regex).test(key)), false)
    ) || validator(schema, data[key])), true),
  properties: (schema, data) =>
    !isObj(data) || Object.keys(schema).reduce(
      (pass, key) => pass && (
        data[key] === undefined || validator(schema[key], data[key])
      )
    , true),
  patternProperties: (schema, data) => 
    !isObj(data) || Object.keys(schema).reduce(
      (pass, regex) => Object.keys(data).reduce(
        (pass, key) => pass && (
          !(new RegExp(regex).test(key)) ||
          validator(schema[regex], data[key])
        )
      , pass)
    , true)
  ,
  dependentSchemas: (schema, data) => {
    if (!isObj(data)) {
      return true
    }
    const Keys = Object.keys(data)

    return Object.keys(schema).reduce((pass, key) => pass && (
      Keys.indexOf(key) == -1 || validator(schema[key], data)
    ), true)
  },
  propertyDependencies: (schema, data) => true,
  propertyNames: (schema, data) => true,
  if: (schema, data, parent) => 
    validator(schema, data) ?
      validator(parent.then || true, data) :
      validator(parent.else || true, data),
  allOf: (schema, data) =>
    schema.reduce((pass, item) => pass && validator(item, data), true),
  anyOf: (schema, data) =>
    schema.reduce((pass, item) => pass || validator(item, data), false),
  oneOf: (schema, data) =>
    schema.reduce((n, item) => n + (validator(item, data) ? 1 : 0), 0) === 1,
  not: (schema, data) => !validator(schema, data),
}
