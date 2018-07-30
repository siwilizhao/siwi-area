let instance = null
class Utils {
    constructor() {
        if (!instance) {
            instance = this
        }
        return instance
    }
    log(msg) {
        if (process.env.NODE_ENV == 'dev') {
            console.log(msg)
        }
        return true
    }
}

module.exports = new Utils()