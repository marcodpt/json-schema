import {copy} from './src/lib.js'

export default v => {
  const str = X => JSON.stringify(X, undefined, 2)
  const data = (R, x) => (schema, path, validate) => {
    R.push([schema, path, validate(
      schema.default !== undefined ? schema.default : x
    )])
  }

  QUnit.test('iterator', assert => {
    const eq = (X, Y) => assert.strictEqual(str(X), str(Y))

    var R = []

    v(undefined, data(R, null))
    eq(R, [])

    v(null, data(R, null))
    eq(R, [])

    v(false, data(R, null))
    eq(R, [])

    v(true, data(R, null))
    eq(R, [])

    v(0, data(R, null))
    eq(R, [])

    v(1, data(R, null))
    eq(R, [])

    v(3.14, data(R, null))
    eq(R, [])

    v("", data(R, null))
    eq(R, [])

    v("test", data(R, null))
    eq(R, [])

    v([], data(R, null))
    eq(R, [])

    v({}, data(R, null))
    eq(R, [[{}, '#', '']])

    R = []
    v({type: "null"}, data(R, null))
    eq(R, [[{type: "null"}, '#', '']])

    R = []
    v({type: ["integer", "string"]}, data(R, null))
    eq(R, [[{type: ["integer", "string"]}, '#', 'type']])

    R = []
    v({type: ["integer", "string"], minimum: 3, maximum: 9}, data(R, 10))
    eq(R, [[{
      type: ["integer", "string"],
      minimum: 3,
      maximum: 9
    }, '#', 'maximum']])

    const s = {
      type: "array",
      default: [],
      minItems: 3,
      prefixItems: [
        {
          type: "string",
          default: "test",
          maxLength: 3
        }, {
          type: "number",
          default: 3.14,
          minimum: 3,
          maximum: 4
        }
      ],
      items: {
        properties: {
          id: {
            type: "integer",
            default: 0
          },
          name: {
            type: "string"
            format: "email"
          }
        },
        additionalProperties: {
          type: "string",
          default: ""
        }
      }
    }

    R = []
    v(s, data(R, 10))
    eq(R, [
      [copy(s), '#', 'minItems'],
      [copy(s.prefixItems[0]), '#/prefixItems/0', 'maxLength'],
      [copy(s.prefixItems[1]), '#/prefixItems/1', ''],
      [copy(s.items), '#/items', ''],
      [copy(s.items.properties.id), '#/items/properties/id', ''],
      [copy(s.items.properties.name), '#/items/properties/name', 'type'],
      [copy(s.items.additionalProperties), '#/items/additionalProperties', ''],
    ])
  })
}
