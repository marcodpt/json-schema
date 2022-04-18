import validator from './src/validator.js'

export default schema => data => validator(schema, data)
