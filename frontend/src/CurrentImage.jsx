import { useState } from "react"

export default function CurrentImage() {

    const [BACKEND, setBackend] = useState("http://pi.warmsandybeaches.net/api")

    return (
        <div>
            <img style={{height: "200px"}} src={BACKEND+"/current"} id="current-image" />
        </div>
    )
}