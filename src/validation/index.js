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
  type: (fixed, value) => 
    (typeof fixed == "string" ? [fixed] : fixed).reduce((pass, type) =>
      pass ||
      (type == "null" && value === null) ||
      (type == "boolean" && (value === true || value === false)) ||
      (type == "number" && typeof value == "number") || (
        type == "integer" &&
        typeof value == "number" &&
        Number.isInteger(value)
      ) || (type == "string" && typeof value == "string") ||
      (type == "object" && isObj(value)) ||
      (type == "array" && value instanceof Array)
    , false),
  const: (fixed, value) => eq(fixed, value),
  enum: (fixed, value) => fixed.reduce(
    (contain, item) => contain || eq(item, value),
    false
  ),
  multipleOf: (fixed, value) =>
    typeof value != 'number' ||
    Math.abs(value - fixed * Math.round(value / fixed)) / fixed <= 0.000001,
  maximum: (fixed, value) =>
    typeof value != 'number' ||
    value <= fixed,
  exclusiveMaximum: (fixed, value) =>
    typeof value != 'number' ||
    value < fixed,
  minimum: (fixed, value) =>
    typeof value != 'number' ||
    value >= fixed,
  exclusiveMinimum: (fixed, value) =>
    typeof value != 'number' ||
    value > fixed,
  maxLength: (fixed, value) => 
    typeof value != 'string' ||
    [...value].length <= fixed,
  minLength: (fixed, value) =>
    typeof value != 'string' ||
    [...value].length >= fixed,
  pattern: (fixed, value) =>
    typeof value != 'string' ||
    new RegExp(fixed).test(value),
  maxItems: (fixed, value) =>
    !(value instanceof Array) ||
    value.length <= fixed,
  minItems: (fixed, value) =>
    !(value instanceof Array) ||
    value.length >= fixed,
  uniqueItems: (fixed, value) =>
    !(value instanceof Array) || !fixed ||
    value.reduce(
      (unique, x, i) => value.reduce(
        (unique, y, j) => unique && (j <= i || !eq(x, y))
      , unique)
    , true),
  required: (fixed, value) =>
    !isObj(value) ||
    fixed.reduce((pass, key) => pass && value[key] !== undefined, true)
}
