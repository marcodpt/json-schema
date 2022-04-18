import validation from './src/validation/index.js'

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
  'pattern.json',
  'minimum.json',
  'maximum.json',
  'exclusiveMinimum.json',
  'exclusiveMaximum.json',
  'minLength.json',
  'maxLength.json',
  'minItems.json',
  'maxItems.json',
  'const.json',
  'required.json',
  'multipleOf.json',
  'type.json'
]

const Tests = []
const Ignore = {
  draft3: [
    'minimum.json',
    'maximum.json',
    'exclusiveMinimum.json',
    'exclusiveMaximum.json',
    'const.json',
    'required.json',
    'multipleOf.json',
    'type.json'
  ],
  draft4: [
    'minimum.json',
    'maximum.json',
    'exclusiveMinimum.json',
    'exclusiveMaximum.json',
    'const.json'
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

const validator = schema => data => 
  Object.keys(validation).reduce((pass, keyword) => {
    const fixed = schema[keyword]
    const v = validation[keyword]
    return pass && (fixed === undefined || v(fixed, data))
  }, schema ? true : false)

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

