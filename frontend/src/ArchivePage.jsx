import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Rating from '@mui/material/Rating';

import { useAuth } from './API';
import AlgotMap from './AlgotMap';

function ChallengeImage({ imagePath }) {
    const { APIUrl } = useAuth();

    return <img src={APIUrl + "/images/" + imagePath} id="current-image" />
}

function EditContent({ isContributor, challengeInfo }) {
    const [editing, setEditing] = useState(false);

    const { APIUrl } = useAuth();
    const uploadUrl = `${APIUrl}/edit`

    if (isContributor) {
        return (
            <div>

                <span className='underlined'
                    onClick={() => {
                        setEditing(!editing)
                    }}
                >[{!editing ? "Edit Submission" : "Hide Edit Submission"}]</span>

                {(editing) ? (
                    <div>
                        <hr />
                        <form method='post' action={""} enctype="multipart/form-data">
                            <label htmlFor="title">Title: </label> <input type='text' name="title" value={challengeInfo.title}/>
                            <label htmlFor="x">x: </label><input type='number' name="x" value={challengeInfo.answer.x}/>
                            <label htmlFor="y">y: </label><input type='number' name="y" value={challengeInfo.answer.x}/>
                            <hr />
                            <input type='submit' value={"Submit"}/>
                        </form>
                        <hr />
                        <button>Delete Submission</button>
                    </div>
                ) : ""}

            </div>
        )
    }
}


function ChallengeInfo({ challengeInfo }) {
    const [selectedCoords, setSelectedCoords] = useState({ x: -9999999, y: 0 });
    const [userRating, setUserRating] = useState(null);

    const { setRating, authUsername } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (challengeInfo != undefined) setUserRating(challengeInfo.personalRating)
    }, [challengeInfo])


    const isContributor = (challengeInfo || {}).contributor == authUsername

    if (challengeInfo) {

        if (true) {

            function r(n, r = 1) { return Math.round(n * (10 ^ r)) / (10 ^ r) }
            const answer = challengeInfo.answer


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
                                <td>{Math.trunc(challengeInfo.personalGuess.own.x)}, {Math.trunc(challengeInfo.personalGuess.own.y, 0)}</td>
                                <td>{Math.round(challengeInfo.personalGuess.dst)}</td>
                                <td>{Math.round(challengeInfo.personalGuess.score)}/100</td>
                            </tr>
                        </tbody>


                    </table>
                </span>

                ) : ("")}

                <div style={{ marginTop: "50px" }}>
                    <span>{challengeInfo.title} <br />Submitted by <a className="underlined"
                        onClick={() => { navigate(`/user/${challengeInfo.contributor}`) }}>
                        {challengeInfo.contributor}
                    </a></span><br />
                    <Rating
                        name="simple-controlled"
                        value={userRating}
                        onChange={(event, newValue) => {
                            setUserRating(newValue);
                            setRating(challengeInfo.id, newValue);
                        }}
                    /> (Avg: {r(challengeInfo.averageRating, 0)})
                    <hr />
                    <ChallengeImage imagePath={challengeInfo.id} />

                </div>

                <div id="guess-content" className="centre-flex">
                    <AlgotMap options={{
                        answer: challengeInfo.answer,
                        otherGuesses: challengeInfo.guesses,
                        ownGuess: challengeInfo.personalGuess,
                    }} />
                </div>

                <EditContent isContributor={isContributor} challengeInfo={challengeInfo}/>

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
    const { bearerToken, navBarUpdate } = useAuth();

    const [searchParams] = useSearchParams()
    const id = searchParams.get("id")

    const [challengeInfo, setChallengeInfo] = useState(null)

    const { getChallenge } = useAuth();

    useEffect(() => {
        if (bearerToken != null) {
            getChallenge(id, (e) => {
                setChallengeInfo(e)
            })
        }

    }, [bearerToken, id])

    return (
        <div id="archive-content" className="centre-flex">
            <ChallengeInfo challengeInfo={challengeInfo} />
        </div>
    )
}