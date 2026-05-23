import { useEffect, useState } from 'react';
import { useParams } from "react-router";

import { useAuth } from './API';


// credits to claude lol
function calculateQuartiles(data) {
    const sorted = [...data].sort((a, b) => a - b);
    const n = sorted.length;

    function percentile(arr, p) {
        const idx = (arr.length - 1) * p;
        const lower = Math.floor(idx);
        const upper = Math.ceil(idx);
        if (lower === upper) return arr[lower];
        const weight = idx - lower;
        return arr[lower] * (1 - weight) + arr[upper] * weight;
    }

    return {

        min: sorted[0],
        q1: percentile(sorted, 0.25),
        median: percentile(sorted, 0.5),
        q3: percentile(sorted, 0.75),
        max: sorted[n - 1]
    };
}

export default function StatsPage() {

    const { getUserStats } = useAuth();
    const [userStats, setUserStats] = useState(null);
    const { user } = useParams();





    useEffect(() => {
        getUserStats(user, (e) => {
            setUserStats(e);
        });
    }, [user])

    useEffect(() => {
        if (userStats==null) return;

        const data = calculateQuartiles(userStats.scores)

        const canvas = document.getElementById("chartContainer")
        const ctx = canvas.getContext("2d")

        const lineColour = "#fff"
        const w = canvas.width
        const h = canvas.height


        canvas.width = canvas.width


        ctx.lineWidth = 1
        

        function line(p1,p2) {
            ctx.save()
            ctx.beginPath()
            ctx.moveTo(p1[0], p1[1])
            ctx.lineTo(p2[0], p2[1])
            ctx.closePath()
            ctx.strokeStyle = lineColour
            ctx.stroke()
            ctx.restore()
        }
        function rect(p1,p2) {
            ctx.save()
            ctx.strokeStyle = lineColour
            ctx.strokeRect(p1[0], p1[1], p2[0]-p1[0], p2[1]-p1[1])
            ctx.restore()

        }

        line([0,h],[w,h])
        const n=10
        for (let i = 0; i <= n; i++) {
            line([
                (i/n)*w, h
            ],[
                (i/n)*w, h-((i%2==0)?10:5)
            ])
            
        }

        //ctx.scale(w/100, 1)

        const bh = h*0.25

        const sc = w/100

        //whiskers
        const mh =h/2

        line([data.min*sc,mh],[data.q1*sc,mh])
        line([data.min*sc,mh-(bh/2)],[data.min*sc,mh+(bh/2)])
        
        
        line([data.q3*sc,mh],[data.max*sc,mh])
        line([data.max*sc,mh-(bh/2)],[data.max*sc,mh+(bh/2)])

        //box
        rect([data.median*sc,mh-bh],[data.q3*sc,mh+bh])
        rect([data.q1*sc,mh-bh],[data.median*sc,mh+bh])

        console.log(data)


    }, [userStats, user])

    if (userStats != null) {

        console.log([calculateQuartiles(userStats.scores)])

        return (
            <div>
                <h1>{userStats.username}</h1>
                <hr />
                <p>
                    Score: {Math.round(userStats.currentScore || 0)} ( Average: {Math.round((userStats.currentScore||0)/(userStats.guessCount||1))} )
                </p>
                <p>
                    Guesses: {userStats.guessCount || 0}
                </p>
                <p>
                    Ratings Submitted: {userStats.ratingsMade || 0}
                </p>
                <div>
                    <h4>Score Distribution</h4>
                    <div style={{
                        padding: "15px"
                    }}>
                        <canvas id="chartContainer" style={{
                        height: "100px",
                        width: "100%"
                    }}></canvas>

                    </div>
                    

                </div>
                {
                    (userStats.contributor) ? (
                        <div>
                            <h3>Contributions</h3>
                            <p>
                                Contributions Made: {userStats.contributionCount || 0}
                            </p>
                            <p>
                                Average Contribution Rating: {Math.round(userStats.contributionRating*100)/100 || 0}
                            </p>
                        </div>
                    ) : (
                        ""
                    )
                }


            </div>

        )
    } else { return "" }
}