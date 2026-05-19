import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from 'react';
import { useAuth } from './API';

function ArchiveList({ archives, router }) {
    const { bearerToken } = useAuth();

    if (bearerToken) {
        if (archives) {
            let k = 0
            return archives.map((e) => {
                k += 1
                return (
                    <p key={k}><a
                        onClick={() => router.navigate(`/archive?id=${e.id}`)}
                        href="#" >
                        {e.title}
                    </a></p>
                )
            })
        } else {
            return ""
        }
    } else {
        return <h3>Log in to see previous.</h3>
    }

}


export default function NavBar({ router }) {
    const [archives, setArchives] = useState(null)

    const { getChallenges, bearerToken, navBarUpdate } = useAuth();

    

    const searchParams = new URLSearchParams(window.location.search)
    

    useEffect(() => {
        console.log("getting")
        getChallenges(0, (e) => {
            console.log("got ", e)
            
            setArchives(e)
        })
    }, [bearerToken, navBarUpdate])

    return (
        <div>
            <h3><a
                onClick={() => router.navigate("/", { reloadDocument: 1 })}
                href="#">Current</a></h3>
            <hr />
            <h2>Previous</h2>

            <ArchiveList archives={archives} router={router} />

        </div>
    )
}