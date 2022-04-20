import validator from './src/validator.js'

export default (schema, data) => data === undefined ?
  data => validator(schema, data) :
  validator(schema, data)
