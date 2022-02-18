// TODO: Use actual testing library
const assert = require('assert/strict')
const { Client, Constructor } = require('../index')

assert.notStrictEqual(Client, null)

const client = new Client()
client.fetchDriversAndConstructors()
.then(() => {
    assert.strictEqual(client.drivers.size, 20)
    assert.strictEqual(client.constructors.size, 10)

    assert.strictEqual(client.drivers.get('Leclerc').constructor instanceof Constructor, true)

    console.log('All tests passed.')
})