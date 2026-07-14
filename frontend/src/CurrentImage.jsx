import { useState } from "react"
import { useAuth } from './API';

export default function CurrentImage() {
    const { APIUrl } = useAuth();
    const [ time, setTime ] = useState(new Date().getTime())


    return (
        <img src={APIUrl+"/current"+`?${time}`} id="current-image" 
        onClick={(e)=>{
            window.open(e.target.src)
        }}
        />
    )
}