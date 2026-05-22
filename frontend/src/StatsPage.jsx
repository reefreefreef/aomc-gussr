import { useEffect, useState } from 'react';
import { useParams } from "react-router";

import { useAuth } from './API';


export default function StatsPage() {

    const { getUserStats } = useAuth();
    const [ userStats, setUserStats ] = useState(null);
    const { user } = useParams();





    useEffect(() => {
        getUserStats(user, (e) => {
            setUserStats(e);
        })
    }, [])

    return (
        <div>
            stats!<br />
            {user}<br />
            {JSON.stringify(userStats)}
        </div>

    )
}