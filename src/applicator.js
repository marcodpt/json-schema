import {isObj} from './lib.js'

export default validator => ({
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
  propertyNames: (schema, data) => !isObj(data) || Object.keys(data).reduce(
    (pass, key) => pass && validator(schema, key)
  , true),
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
})
