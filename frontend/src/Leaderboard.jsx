import { useEffect, useState } from 'react';

import { useAuth } from './API';

function LeaderboardTable({ leaderboard }) {
    return <div>
            <h2>Leaderboard</h2>
        <table>
            <thead>

                <tr>
                    <th scope="col">#</th>
                    <th scope="col">User</th>
                    <th scope="col">Score</th>
                    <th scope="col">Avg</th>
                </tr>
            </thead>
            <tbody>
                {leaderboard.map((e, i) => {
                    return <tr>
                        <th scope="row">{i + 1}</th>
                        <td>{e.username}</td>
                        <td>{Math.round(e.currentScore)}</td>
                        <td>{Math.round(e.averageScore)}</td>
                    </tr>
                })}
            </tbody>
        </table>
    </div>
}


export default function Leaderboard() {
    const [personalScore, setPersonalScore] = useState("");
    const [leaderboard, setLeaderboard] = useState([]);

    const { authUsername, getScore, getLeaderboard } = useAuth();


    useEffect(() => {
        getScore(authUsername, (e) => {
            if (e.length > 0) setPersonalScore(Math.round(e[0].currentScore, 1))
        })

    }, [authUsername])
    useEffect(() => {
        getLeaderboard((e) => {
            setLeaderboard(e)
        })

    }, [])

    return (
        <div>
            {(authUsername) ? <h2>Your Score: <span id="personalScore">{personalScore}</span></h2> : ""}
            <hr />
            <div className="leaderBoardScroll">
                <LeaderboardTable leaderboard={leaderboard} />
            </div>
        </div>

    )
}