import { useEffect, useState } from 'react';

import { useAuth } from './API';


export default function Admin() {

    const { bearerToken, exeSQL, setChallenge } = useAuth();
    const [challengeNum, setChallengeNum] = useState(1);
   
    return (
        <div>
            <input value={challengeNum} onChange={(e)=>{console.log(e);setChallengeNum(e.target.value)}} id="set-challenge" type="number" /><button
            onClick={()=>{
                setChallenge(parseInt(document.getElementById("set-challenge").value))
            }}
            >set challenge id</button>
            <hr />
            <textarea name="sql-input" id="sql-input"></textarea>
            <button onClick={()=>{
                const sql = document.getElementById("sql-input").value
                console.log(sql)
                exeSQL(sql, (e)=>{
                    console.log(e)
                    document.getElementById("sql-output").textContent = JSON.stringify(e)
                })
            }}>Execute</button><hr />
            <p id="sql-output"></p>
        </div>
        
    )
}