import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from 'react';
import { useAuth } from './API';

function ArchiveList({ archives, router }) {
    const { bearerToken, navBarUpdate, setNavBarUpdate } = useAuth();
    

    if (bearerToken) {
        if (archives) {
            let k = 0
            return archives.map((e) => {
                k += 1
                return (
                    <p key={k}><a className="underlined"
                        onClick={() => {router.navigate(`/archive/${e.id}`); setNavBarUpdate(navBarUpdate)}}>
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
    const [contributions, setContributions] = useState(null)

    const { getChallenges, bearerToken, navBarUpdate, isContributor, isAdmin, authUsername } = useAuth();



    const searchParams = new URLSearchParams(window.location.search)


    useEffect(() => {
        ("getting")
        getChallenges("guessed", (e) => {
            setArchives(e)
        })
        getChallenges("contributed", (e) => {
            setContributions(e)
        })
    }, [bearerToken, navBarUpdate])

    return (
        <div>
            {((isAdmin||isContributor)&&authUsername)?(
                <div>
                    {(isContributor)?(
                        <span className='underlined'
                        onClick={() => {router.navigate(`/contribute`)}}
                        >
                            Contribute
                        </span>
                    ):""}
                    {(isAdmin&&isContributor)?(" | "):""}
                    {(isAdmin)?(
                        <span className='underlined'
                        onClick={() => {router.navigate(`/admin`)}}
                        >
                            Admin Console
                        </span>
                    ):""}
                    
                    <hr />
                </div>
            ):""}
            <h3><a className="underlined"
                onClick={() => router.navigate("/", { reloadDocument: 1 })}>Current</a></h3>
            <hr />
            <h2>Previous</h2>

            <div className="navBarScroll">
                <ArchiveList archives={archives} router={router} />
            </div>
            <hr />
            <h2>Submitted</h2>
            <div className="navBarScroll">
                <ArchiveList className="navBarScroll" archives={contributions} router={router} />
            </div>

        </div>
    )
}