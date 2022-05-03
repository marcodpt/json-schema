export default v => {
  QUnit.test('onError', assert => {
    var err = ''
    const t = v({
      type: 'integer',
      minimum: 10,
      maximum: 20,
      multipleOf: 2
    })
    const onError = e => {err = e}

    t(4, onError)
    assert.strictEqual(err, 'minimum')

    t(34, onError)
    assert.strictEqual(err, 'maximum')

    t('14', onError)
    assert.strictEqual(err, 'type')

    t(15, onError)
    assert.strictEqual(err, 'multipleOf')
  })
}
