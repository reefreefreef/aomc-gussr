import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useAuth } from './API';
import AlgotMap from './AlgotMap';

function ChallengeImage({ imagePath }) {
    const { APIUrl } = useAuth();

    return <img src={APIUrl+"/images/"+imagePath} id="current-image" />
}


function ChallengeInfo({ challengeInfo }) {
    console.log(challengeInfo)
    if (challengeInfo) {

        if (challengeInfo.revealed) {
            return <div>
                    {JSON.stringify(challengeInfo)}
                    <ChallengeImage imagePath={challengeInfo.id}/>
                    <AlgotMap options={{
                        answer: challengeInfo.answer,
                        otherGuesses:challengeInfo.guesses
                    }}/>
                </div>
        } else {
            return <div>
                    {JSON.stringify(challengeInfo)}
                    <ChallengeImage imagePath={challengeInfo.id}/>
                </div>
        }
    } else {
        return ""
    }
}

export default function ArchivePage() {

    const [searchParams] = useSearchParams()
    const id = searchParams.get("id")

    const [challengeInfo, setChallengeInfo] = useState(null)

    const { getChallenge } = useAuth();

    useEffect(()=>{
        console.log(getChallenge(id, (e)=>{
            setChallengeInfo(e)
        }))
    }, [])

    return (
        <div id="main-content" class="centre-flex">
      <ChallengeInfo challengeInfo={challengeInfo}/>
    </div>
    )
}