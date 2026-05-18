import { useEffect, useState } from 'react';

import { useAuth } from './API';

function LeaderboardTable({ leaderboard }) {
    return <table>
  <caption>
    <h2>Leaderboard</h2>
  </caption>
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">User</th>
      <th scope="col">Score</th>
    </tr>
  </thead>
  <tbody>
    {leaderboard.map((e, i)=>{
        return <tr>
            <th scope="row">{i+1}</th>
            <td>{e.username}</td>
            <td>{Math.round(e.currentScore)}</td>
            </tr>
    })}
  </tbody>
</table>
}


export default function Leaderboard() {
    const [personalScore, setPersonalScore] = useState("");
    const [leaderboard, setLeaderboard] = useState([]);

    const { authUsername, getScore, getLeaderboard } = useAuth();


    useEffect(()=>{
        getScore(authUsername, (e)=>{
            if (e.length>0) setPersonalScore(Math.round(e[0].currentScore,1))
        })
        
    }, [authUsername])
    useEffect(()=>{
        getLeaderboard((e)=>{
            setLeaderboard(e)
        })
        
    }, [])

    return (
        <div>
            {(authUsername)?<h2>Your Score: <span id="personalScore">{personalScore}</span></h2>:""}
            <hr />
            <LeaderboardTable leaderboard={leaderboard} />
        </div>
        
    )
}