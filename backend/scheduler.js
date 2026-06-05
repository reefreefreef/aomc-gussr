const db = require("./db/db.js")


function weightedPick(picks) {
    const totalWeight = picks.reduce((p,a)=>{
        return p + a.weight
    }, 0)


    var i, sum = 0, r = Math.random();
    for (i in picks) {
        sum += picks[i].weight/totalWeight;
        if (r <= sum) return i;
    }
    
}


async function getLeastGuessed(count) {
    var counts = await db.raw('select challenges.id, challenges.title, counts.c from challenges left join (select challengeId, count(*) as c from guesses group by challengeId) as counts on counts.challengeId=challenges.id')

    counts = counts.sort((a, b) => {
        return a.c - b.c
    })

    return counts.slice(0, Math.min(counts.length, count))
}
async function getLeastRecent(count) {
    var counts = await db.raw('select id, title, last_shown from challenges')

    counts = counts.sort((a, b) => {
        return a.last_shown - b.last_shown
    })

    return counts.slice(0, Math.min(counts.length, count))
}
async function getWeights() {
    var counts = await db.raw('select challenges.id, challenges.title, challenges.last_shown, counts.c from challenges left join (select challengeId, count(*) as c from guesses group by challengeId) as counts on counts.challengeId=challenges.id')

    for (let i = 0; i < counts.length; i++) {
        const challenge = counts[i];

        let timeComp = Math.min(((new Date()).getTime() - (challenge.last_shown || -Infinity)) / (1000 * 60 * 60 * 24), 2)

        let guessComp = Math.min(20 * (Math.pow((challenge.c || 0) + 1, -0.8)), 20) / 20


        challenge.weight = Math.pow(timeComp + guessComp, 2)

    }

    return counts

}

async function selectChallenge(id) {
    await db("app_flags").where("key", "current_challenge").update("value", id)

    await db("challenges").where("id", id).update("last_shown", (new Date()).getTime())
}


async function rotateChallenge() {
    const weights = await getWeights()

    const chosen = weightedPick(weights)

    console.log(`setting current challenge to ${chosen}`)

    selectChallenge(chosen)
}


function scheduleEvery(milliseconds, callback) {

    let previousNow = 0
    setInterval(() => {
        const now = (new Date().getTime()) % milliseconds

        if (previousNow > now) {
            callback()
        }
        previousNow = now

    }, 50);
}

module.exports = { rotateChallenge: rotateChallenge, getLeastGuessed: getLeastGuessed, scheduleEvery: scheduleEvery, selectChallenge: selectChallenge };