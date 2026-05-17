import { useEffect, useState } from 'react';
import AlgotMap from "./AlgotMap.jsx"
import { useAuth } from './API';

function SubmitButton({coords, updatePrevGuess}) {
    const { bearerToken, submitGuess } = useAuth();



    if (bearerToken) {
        return (
            <span>
                <span id="selectedCoords">Selected: ({parseInt(coords.x)}, {parseInt(coords.y)})</span>
                <button id="selectedSubmit"
                    onClick={() => {
                        submitGuess(coords);
                        updatePrevGuess(coords);
                    }
                }
                >Submit Guess</button>
            </span>
        )
    } else {
        return <h3>Login to submit guess</h3>
    }
}


export default function GuessSubmission() {

    const [selectedCoords, setSelectedCoords] = useState({ x: 0, y: 0 });
    const [previousGuess, setPreviousGuess] = useState(null)


    return (
        <div id="guess-content" class="centre-flex">
            <AlgotMap set={setSelectedCoords} setPrevGuess={setPreviousGuess} prevGuess={previousGuess}/>
            <SubmitButton coords={selectedCoords} updatePrevGuess={setPreviousGuess}/>
        </div>)
}