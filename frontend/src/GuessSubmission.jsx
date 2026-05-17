import { useEffect, useState } from 'react';
import AlgotMap from "./AlgotMap.jsx"
import { useAuth } from './API';

function SubmitButton({coords}) {
    const { bearerToken, submitGuess } = useAuth();


    if (bearerToken) {
        return (
            <span>
                <span id="selectedCoords">Selected: ({parseInt(coords.x)}, {parseInt(coords.y)})</span>
                <button id="selectedSubmit"
                    onClick={() => submitGuess(coords)}
                >Submit Guess</button>
            </span>
        )
    } else {
        return ""
    }
}


export default function GuessSubmission() {

    const [selectedCoords, setSelectedCoords] = useState({ x: 0, y: 0 });

    return (
        <div id="guess-content" class="centre-flex">
            <AlgotMap set={setSelectedCoords} />
            <SubmitButton coords={selectedCoords}/>
        </div>)
}