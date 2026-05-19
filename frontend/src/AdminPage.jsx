import { useEffect, useState } from 'react';

import { useAuth } from './API';



export function DataTable({ data }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  const columns = Object.keys(data[0]);
  
  let sorted = [...data];
  if (sortColumn) {
    sorted.sort((a, b) => {
      if (a[sortColumn] > b[sortColumn]) return sortAsc ? 1 : -1;
      if (a[sortColumn] < b[sortColumn]) return sortAsc ? -1 : 1;
      return 0;
    });
  }

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(column);
      setSortAsc(true);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} onClick={() => handleSort(column)} style={{ cursor: 'pointer' }}>
              {column} {sortColumn === column && (sortAsc ? '↑' : '↓')}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column) => (
              <td key={`${rowIndex}-${column}`}>{String(row[column])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}


export default function Admin() {

    const { bearerToken, exeSQL, setChallenge, getChallenges } = useAuth();
    const [challengeNum, setChallengeNum] = useState(1);
    const [challenges, setChallenges] = useState(undefined);

    useEffect(()=>{
        getChallenges(true, (e) => {
          console.log(e)
            setChallenges(e)
        })
    }, [bearerToken])
   
    return (
        <div>
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
            <input value={challengeNum} onChange={(e)=>{console.log(e);setChallengeNum(e.target.value)}} id="set-challenge" type="number" /><button
            onClick={()=>{
                setChallenge(parseInt(document.getElementById("set-challenge").value))
            }}
            >set challenge (id)</button>
            <hr />
            <div id="challengesTable">
                <DataTable data={challenges}/>
            </div>
            
        </div>
        
    )
}