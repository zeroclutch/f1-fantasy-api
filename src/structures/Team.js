/**
 * A team that users can construct
 * @class
 */
 class Team {
    constructor(props, client) {
        Object.assign(this, props)
        
        /**
         * The client that this object was instantiated from.
         * @type {Client}
         */
         this.client = client

        /**
         * The list of players for this team
         * @type {Map<Player>}
         */
        this.players = new Map()
    }
}

module.exports = Team