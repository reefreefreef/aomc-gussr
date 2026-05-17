
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from 'react';
import { useAuth } from './API';

function ArchiveList({ archives, router }) {
    if (archives) {
        let k = 0
        return archives.map((e)=>{
            k+=1
            return (
                <p key={k}><a
                onClick={()=>router.navigate(`/archive?id=${e.id}`)}
                href="#" >
                    {e.title}
                    </a></p>
            )
        })
    } else {
        return ""
    }
}


export default function NavBar({ router }) {
    const [archives, setArchives] = useState(null)
    
    const { getChallenges } = useAuth();

    useEffect(()=>{
        getChallenges((e)=>{
            setArchives(e)
        })
    }, [])
    
    return (
        <div>
            <h3><a 
            onClick={()=>router.navigate("/", {reloadDocument:1})}
            href="#">Current</a></h3>
            <hr />
            <h3>Previous</h3>

            <ArchiveList archives={archives} router={router}/>
            
        </div>
    )
}