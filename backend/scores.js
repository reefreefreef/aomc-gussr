const db = require("./db/db.js")


function evaluateScore(guess, answer) {
    const dst = Math.sqrt(((guess.x-answer.x)**2)+((guess.y-answer.y)**2))

    const adjustedScore = 500/((dst/100)+5)

    return adjustedScore
}

async function updateScores() {
    const users = await db("users").select("*")

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        var userScore = 0
        
        const userGuesses = await db.from("guesses").innerJoin("challenges", "guesses.challengeId", "challenges.id").select("id", "guess", "challenges.answer").where("guesses.user", user.username)

        for (let j = 0; j < userGuesses.length; j++) {
            const userGuess = userGuesses[j];

            userScore += evaluateScore(
                JSON.parse(userGuess.guess),
                JSON.parse(userGuess.answer)
            )
            
        }

        await db("users").where("username", user.username).update("currentScore", userScore)
    }
}

async function getScore(user) {
    return await db("users").select("currentScore").where("username", user)
}

async function getLeaderboard() {
    const scores = await db("users").select("username", "currentScore")
    for(let i in scores) {
        const otherGuesses = await db("guesses").where("user", scores[i].username)

        scores[i].averageScore = otherGuesses.length>0?scores[i].currentScore/(otherGuesses.length):0
    }

    return scores.sort((a, b)=>{
        return b.currentScore-a.currentScore
    })
}


module.exports = {updateScores:updateScores, getScore:getScore, evaluateScore:evaluateScore, getLeaderboard:getLeaderboard};