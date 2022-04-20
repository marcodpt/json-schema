import {isObj, eq} from './lib.js'

const keywords = {
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
  }
}

export default schema => data => Object.keys(keywords)
  .reduce((err, key) =>
    err || schema[key] === undefined ? err :
    keywords[key](schema[key], data) ? '' : key
  , '')
