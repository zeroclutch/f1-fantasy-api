// TODO: Use actual testing library
const assert = require('assert/strict')
const { AUTHENTICATED } = require('../constants/endpoints')
const { Client } = require('../index')

assert.notStrictEqual(Client, null)

module.exports = async () => {
    const client = new Client()
    await client.login(process.env.FANTASY_USERNAME, process.env.FANTASY_PASSWORD).catch(console.error)
    
    let pickedTeams = await client._request({
        url: AUTHENTICATED.PICKED_TEAMS + '?game_period_id=null&my_current_picked_teams=true&my_next_picked_teams=false',
        authenticated: true
    }).catch(console.error)

    assert.notStrictEqual(pickedTeams, undefined)

    console.log('All tests passed.')
}