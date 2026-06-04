const db = require("./db/db.js")


function weightedPick(picks) {
    const totalWeight = picks.reduce((partialSum, a) => partialSum + a.weight, 0)
    console.log(totalWeight, picks)
   
    var i, sum=0, r=Math.random();
    for (i in picks) {
        sum += picks[i].weight;
        if (r <= sum) return i;
    }

}


async function getChallengeWeights(count) {
    var counts = await db.raw('select challenges.id, challenges.title, counts.c, challenges.last_shown from challenges left join (select challengeId, count(*) as c from guesses group by challengeId) as counts on counts.challengeId=challenges.id')

    for (let i = 0; i < counts.length; i++) {
        const challenge = counts[i];

        challenge.weight = 
            (challenge.c/5) +
            ((new Date()).getTime()-(challenge.last_shown||-Infinity))/(1000*60*60*6)    
            
        console.log(challenge.title, (challenge.c/5), ((new Date()).getTime()-challenge.last_shown)/(1000*60*60*6)    )
        
    }
    
    return counts.slice(0, Math.min(counts.length, count))
}


async function selectChallenge(id) {
    await db("app_flags").where("key", "current_challenge").update("value", id)

    await db("challenges").where("id", id).update("last_shown", (new Date()).getTime())
}

async function test() {
    const weights = getChallengeWeights(50)
    console.log(weights)
    console.log(weightedPick(weights))
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