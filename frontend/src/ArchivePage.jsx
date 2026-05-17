import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useAuth } from './API';
import AlgotMap from './AlgotMap';

function ChallengeImage({ imagePath }) {
    const { APIUrl } = useAuth();

    return <img src={APIUrl + "/images/" + imagePath} id="current-image" />
}


function ChallengeInfo({ challengeInfo }) {
    console.log(challengeInfo)
    if (challengeInfo) {

        if (challengeInfo.revealed) {

            function r(n) { return Math.round(n) }
            const answer = JSON.parse(challengeInfo.answer)
            console.log(challengeInfo, answer)

            return <div className="centre-flex" id="archivePersonalResults">

                <h1>Answer: ({answer.x}, {answer.y})</h1>

                {(challengeInfo.personalGuess) ? (<span>


                    

                    <table>
                        <thead>
                            <tr>
                                <th><h3>Your Guess</h3></th>
                                <th><h3>Distance</h3></th>
                                <th><h3>Score</h3></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{r(challengeInfo.personalGuess.own.x)}, {r(challengeInfo.personalGuess.own.y)}</td>
                                <td>{r(challengeInfo.personalGuess.dst)}</td>
                                <td>_</td>
                            </tr>
                        </tbody>


                    </table>
                    </span>

                ) : ("")}

                <div style={{marginTop: "50px"}}>
                    <span>{challengeInfo.title}</span><br />
                    <ChallengeImage imagePath={challengeInfo.id} />
                    
                </div>

                <div id="guess-content" className="centre-flex">
                    <AlgotMap options={{
                        answer: challengeInfo.answer,
                        otherGuesses: challengeInfo.guesses,
                        ownGuess: challengeInfo.personalGuess,
                    }} />
                </div>

            </div>
        } else {
            return <div id="guess-content" className="centre-flex">
                <h2>Location not yet revealed.</h2>
                <ChallengeImage imagePath={challengeInfo.id} />
            </div>
        }
    } else {
        return ""
    }
}

export default function ArchivePage() {
    const { bearerToken } = useAuth();

    const [searchParams] = useSearchParams()
    const id = searchParams.get("id")

    const [challengeInfo, setChallengeInfo] = useState(null)

    const { getChallenge } = useAuth();

    useEffect(() => {
        console.log(getChallenge(id, (e) => {
            setChallengeInfo(e)
        }))
    }, [bearerToken, id])

    return (
        <div id="archive-content" className="centre-flex">
            <ChallengeInfo challengeInfo={challengeInfo} />
        </div>
    )
}