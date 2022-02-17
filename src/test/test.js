// TODO: Use actual testing library
const assert = require('assert/strict')
const { Client } = require('../index')

assert.notStrictEqual(Client, null)

const client = new Client()
client.fetchDriversAndConstructors()
.then(() => {
    console.log(client)
})