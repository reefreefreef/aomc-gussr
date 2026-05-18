import { useEffect, useState } from 'react';
import AlgotMap from "./AlgotMap.jsx"
import { useAuth } from './API';

import { useNavigate } from "react-router";

function SubmitButton({ coords, previousGuess, updatePrevGuess }) {
    const { bearerToken, submitGuess, getCurrent, setNavBarUpdate, navBarUpdate } = useAuth();

    const navigate = useNavigate();



    if (bearerToken) {
        if (previousGuess) {
            return (
                <h3>Already Guessed <a
                onClick={()=>{
                    getCurrent((e) => {
                        navigate(`/archive?id=${e}`)
                        setNavBarUpdate(!navBarUpdate)
                    })
                }}
                >See Results</a></h3>
            )
        } else {
            return (
                <span>
                    <span id="selectedCoords">Selected: ({parseInt(coords.x)}, {parseInt(coords.y)})</span>
                    <button id="selectedSubmit"
                        onClick={() => {
                            submitGuess(coords);
                            updatePrevGuess(coords);

                            getCurrent((e) => {
                                navigate(`/archive?id=${e}`)
                                setNavBarUpdate(!navBarUpdate)
                            })
                        }
                        }
                    >Submit Guess</button>
                </span>
            )
        }

    } else {
        return <h3>Login to submit guess</h3>
    }
}


export default function GuessSubmission() {

    const [selectedCoords, setSelectedCoords] = useState({ x: 0, y: 0 });
    const [previousGuess, setPreviousGuess] = useState(null)


    return (
        <div id="guess-content" className="centre-flex">
            <AlgotMap options={{
                input: setSelectedCoords,
                setPrevious: setPreviousGuess,
                previous: previousGuess,
            }} />
            <SubmitButton coords={selectedCoords} previousGuess={previousGuess} updatePrevGuess={setPreviousGuess} />
        </div>)
}