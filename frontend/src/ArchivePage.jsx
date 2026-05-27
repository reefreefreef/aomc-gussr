import { useParams, useNavigate } from 'react-router-dom';
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

    const [title, setTitle] = useState(challengeInfo.title);
    const [x, setX] = useState(challengeInfo.answer.x);
    const [y, setY] = useState(challengeInfo.answer.y);

    const { APIUrl, bearerToken, editSubmission, deleteSubmission } = useAuth();
    const editUrl = `${APIUrl}/${challengeInfo.id}/edit`

    useEffect(() => {

        if (bearerToken) {

            const form = document.querySelector('form');
            console.log("alksjdsa", form)
            if (!form) return;

            form.addEventListener('submit', async (event) => {
                event.preventDefault(); // Stop standard form submission

                var reqBody = {};
                (new FormData(form)).forEach((value, key) => reqBody[key] = value);
                console.log(reqBody)
                fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${bearerToken}`,
                        'Content-Type': 'application/json',

                    },
                    body: JSON.stringify(reqBody)
                }).then(res => {
                    return res.json()
                }).then((res) => {
                    if (res.error) {
                        alert(res.message)
                    } else {
                        alert("submitted!")
                        window.location.reload()
                    }

                })


            });
        }
    }, [bearerToken, editing])

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
                        <form method='post' action={editUrl} enctype="multipart/form-data">
                            <label htmlFor="title">Title: </label> <input type='text' name="title" value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                }}
                            />
                            <br />
                            <label htmlFor="x">x: </label><input type='number' name="x" value={x}
                                onChange={(e) => {
                                    setX(e.target.value)
                                }}
                            />
                            <label htmlFor="y">y: </label><input type='number' name="y" value={y}
                                onChange={(e) => {
                                    setY(e.target.value)
                                }}
                            />
                            <hr />
                            <input style={{ display: "none" }} type='text' name="id" value={challengeInfo.id} />
                            <input type='submit' value={"Submit"} />
                        </form>
                        <hr />
                        <button
                            onClick={() => {
                                deleteSubmission(challengeInfo.id, (e) => {
                                    alert(e.message)
                                })
                            }}
                        >Delete Submission</button>
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
                    {(!isContributor) ? (
                        <span>
                            <Rating
                                name="simple-controlled"
                                value={userRating}
                                onChange={(event, newValue) => {
                                    setUserRating(newValue);
                                    setRating(challengeInfo.id, newValue);
                                }}
                            /> (Avg: {r(challengeInfo.averageRating, 0)})
                        </span>
                    ) : ("")}
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

                <EditContent isContributor={isContributor} challengeInfo={challengeInfo} />

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

    const { id } = useParams();

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