// TODO: Use actual testing library
const assert = require('assert/strict')
const { Client, Constructor } = require('../index')

module.exports = async () => {
    assert.notStrictEqual(Client, null)

    const client = new Client()
    await client.fetchDriversAndConstructors()
    assert.strictEqual(client.drivers.size, 20)
    assert.strictEqual(client.constructors.size, 10)

    assert.strictEqual(client.drivers.get(15).constructor instanceof Constructor, true)

    console.log('Unauthenticated tests passed.')
}