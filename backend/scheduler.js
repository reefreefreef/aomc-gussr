const db = require("./db/db.js")


function weightedPick(picks) {
    console.log(picks)
}


async function getLeastGuessed(count) {
    var counts = await db.raw('select challenges.id, challenges.title, counts.c from challenges left join (select challengeId, count(*) as c from guesses group by challengeId) as counts on counts.challengeId=challenges.id')

    counts = counts.sort((a,b)=>{
        return a.c-b.c
    })
    
    return counts.slice(0, Math.min(counts.length, count))
}
async function getLeastRecent(count) {
    var counts = await db.raw('select id, title, last_shown from challenges')

    counts = counts.sort((a,b)=>{
        return a.last_shown-b.last_shown
    })
    
    return counts.slice(0, Math.min(counts.length, count))
}

async function selectChallenge(id) {
    await db("app_flags").where("key", "current_challenge").update("value", chosen.id)

    await db("challenges").where("id", id).update("last_shown", (new Date()).getTime())
}

async function test() {
    console.log(await getLeastRecent(20))
}


function scheduleEvery(milliseconds, callback) {
    
    let previousNow = 0
    setInterval(() => {
        const now = (new Date().getTime())%milliseconds

        if (previousNow>now) {
            callback()
        }
        previousNow = now

    }, 50);
}

module.exports = {test:test, getLeastGuessed:getLeastGuessed, scheduleEvery:scheduleEvery, selectChallenge:selectChallenge};