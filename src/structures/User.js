const Team = require("./Team")

/**
 * An F1 Fantasy player
 * @class
 */
class User {
    constructor(props, client) {
        Object.assign(this, props)
        
        /**
         * The client that this object was instantiated from.
         * @type {Client}
         */
        this.client = client

        /**
         * The currently picked teams, keyed by slot id
         * @type {Map<Number,Team>}
         */
        this.currentTeams = new Map()
    }

    async init() {
        await this.fetchCurrentTeams()
    }

    fetchCurrentTeams() {
        return new Promise(async (resolve, reject) => {
            for(let slot of [1,2,3]) {
                let teamData = await this.client.request({
                    url: `/for_slot?slot=${slot}&user_global_id=${this.user_global_id}`,
                    authenticated: true
                }).catch(reject)

                // Ensure team exists
                if(!teamData.errors && teamData.pickedTeam) {

                    let team = new Team(teamData.pickedTeam, this.client)

                    // Assign user to team
                    team.user = this
                    for(let player of team.picked_players) {
                        team.players.set(player.slot, this.client.players.get(player.player_id))
                    }

                    this.currentTeams.set(team.slot, team)
                }
            }

            resolve(this.currentTeams)
        })
    }
}

module.exports = User