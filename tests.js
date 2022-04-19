import validator from './index.js'

const path = 'JSON-Schema-Test-Suite/tests'

const drafts = [
  'draft3',
  'draft4',
  'draft6',
  'draft7',
  'draft2019-09',
  'draft2020-12'
]

const files = [
  'boolean_schema.json',
  'format.json',
  //'vocabulary.json',
  'content.json',
  'default.json',

  'type.json',
  'const.json',
  'enum.json',
  'multipleOf.json',
  'maximum.json',
  'exclusiveMaximum.json',
  'minimum.json',
  'exclusiveMinimum.json',
  'maxLength.json',
  'minLength.json',
  'pattern.json',
  'maxItems.json',
  'minItems.json',
  'uniqueItems.json',
  'maxContains.json',
  'minContains.json',
  'maxProperties.json',
  'minProperties.json',
  'required.json',
  'dependentRequired.json',
  'dependencies.json',

  'prefixItems.json',
  'additionalItems.json',
  //'items.json',
  'contains.json',
  'additionalProperties.json',
  'properties.json',
  'patternProperties.json',
  'dependentSchemas.json',
  'if-then-else.json',
  'allOf.json',
  'anyOf.json',
  'oneOf.json',
  'not.json',
]

const Tests = []
const Ignore = {
  draft3: [
    'boolean_schema.json',
    'vocabulary.json',
    'content.json',
    'exclusiveMinimum.json',
    'exclusiveMaximum.json',
    'const.json',
    'multipleOf.json',
    'maxContains.json',
    'minContains.json',
    'maxProperties.json',
    'minProperties.json',
    'dependentRequired.json',
    'dependentSchemas.json',
    'prefixItems.json',
    'contains.json',
    'allOf.json',
    'anyOf.json',
    'oneOf.json',
    'not.json',
    'if-then-else.json'
  ],
  draft4: [
    'boolean_schema.json',
    'vocabulary.json',
    'content.json',
    'exclusiveMinimum.json',
    'exclusiveMaximum.json',
    'const.json',
    'contains.json',
    'maxContains.json',
    'minContains.json',
    'dependentRequired.json',
    'dependentSchemas.json',
    'prefixItems.json',
    'if-then-else.json'
  ],
  draft6: [
    'vocabulary.json',
    'content.json',
    'content.json',
    'maxContains.json',
    'minContains.json',
    'dependentRequired.json',
    'dependentSchemas.json',
    'prefixItems.json',
    'if-then-else.json'
  ],
  draft7: [
    'vocabulary.json',
    'content.json',
    'content.json',
    'maxContains.json',
    'minContains.json',
    'dependentRequired.json',
    'dependentSchemas.json',
    'prefixItems.json'
  ],
  'draft2019-09': [
    'dependencies.json',
    'prefixItems.json'
  ],
  'draft2020-12': [
    'dependencies.json',
    'additionalItems.json'
  ]
}

drafts.forEach(draft => {
  files.forEach(file => {
    const I = Ignore[draft]
    if (!I || I.indexOf(file) == -1) {
      Tests.push(`${path}/${draft}/${file}`)
    }
  })
})

QUnit.config.autostart = false

Promise.all(Tests.map(test => fetch(test)
  .then(response => response.json())
  .then(data => ({
    data: data,
    draft: test.split('/')[2]
  }))
))
  .then(response => {
    QUnit.start()
    console.log(response)
    response.forEach(({draft, data}) => {
      data.forEach(({schema, description, tests}) => {
        const v = validator(schema)
        QUnit.test(draft+': '+description, assert => {
          tests.forEach(({
            description,
            data,
            valid
          }) => {
            assert.strictEqual(v(data), valid, description)
          })
        })
      })
    })
  })

