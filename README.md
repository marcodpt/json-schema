# json-schema
My own approach on json-schmea

## Clone tests
```
git clone https://github.com/json-schema-org/JSON-Schema-Test-Suite.git
```

## Usage
```
import validator from 'https://cdn.jsdelivr.net/gh/marcodpt/json-schema/index.js'

const v = validator({
  type: "object",
  properties: {
    foo: {
      type: "string"
    },
    bar: {
      type: "integer"
    }
  }
})

console.log(v({}))
//true
console.log(v({foo: "foo"}))
//true
console.log(v({foo: 3}))
//false
console.log(v({bar: 3}))
//true
console.log(v({bar: "bar"}))
//false
console.log(v({
  foo: "foo",
  bar: 3
}))
//true

```

## TODO
 - build tests script
 - pass all json schema spec
 - deno tests
 - error handler
