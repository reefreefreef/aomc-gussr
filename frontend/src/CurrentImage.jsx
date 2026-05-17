import { useState } from "react"
import { useAuth } from './API';

export default function CurrentImage() {
    const { APIUrl } = useAuth();
    const [BACKEND, setBackend] = useState(APIUrl)

    return (
        <img src={BACKEND+"/current"} id="current-image" />
    )
}