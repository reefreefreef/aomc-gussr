import { useEffect, useState } from 'react';
import AlgotMap from "./AlgotMap.jsx"
import { useAuth } from './API';

import { useNavigate } from "react-router";

function SubmitButton({ coords, previousGuess, updatePrevGuess }) {
    const { bearerToken, authUsername, submitGuess, getCurrent, setNavBarUpdate, navBarUpdate, getChallenge } = useAuth();
    const [ currentId, setCurrentId ] = useState(null)
    const [ isContributor, setIsContributor ] = useState(false)

    const navigate = useNavigate();

    useEffect(()=>{
        getCurrent((e) => {
            setCurrentId(e)
            getChallenge(e, (challenge) => {
                if (challenge!=undefined) {
                    setIsContributor(challenge.contributor==authUsername)

                }
            }, true)
        })
        
    }, [bearerToken])



    if (bearerToken) {
        if (previousGuess||isContributor) {
            return (
                
                <h3>{isContributor?"Own image. ":"Already Guessed. "}<a className="underlined"
                onClick={()=>{
                    getCurrent((e) => {
                        navigate(`/archive/${e}`)
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
                            if (currentId!=null) {
                                getCurrent((e) => {
                                    if (e!=currentId) {
                                        alert("current image has changed, sorry :(");
                                        window.location.reload();
                                        return;
                                    }
                                    submitGuess(coords, ()=>{
                                        navigate(`/archive/${e}`)
                                        setNavBarUpdate(!navBarUpdate)
                                        updatePrevGuess(coords);
                                    });
    
                                
                                    
                                })

                            }
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