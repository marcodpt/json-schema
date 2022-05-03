import validator from './src/validator.js'

export default (schema, data, onError) => data === undefined ?
  (data, onError) => validator(schema, data, onError) :
  validator(schema, data, onError)
