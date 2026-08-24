import { useEffect, useState } from 'react';
import { useParams } from "react-router";

import { useAuth } from './API';
import AlgotMap from './AlgotMap';

export default function HeatmapPage() {

    const { getHeatmap } = useAuth();
    const [heatmapData, setHeatmapData] = useState([])


    useEffect(() => {
        getHeatmap((e) => {
            setHeatmapData(e)
        })


    }, [])

    if (heatmapData.length>0) {
        return <div className="centre-flex">

            <AlgotMap options={{
                heatmap: heatmapData
            }} />
        </div>
    } else {
        return <div className="centre-flex">

            No heatmap data today. Come back on Tuesday
        </div>
    }

}