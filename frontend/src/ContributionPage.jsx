import { useEffect, useState } from 'react';

import { useAuth } from './API';
import { useNavigate } from "react-router-dom";


export default function Contribution() {

    const { APIUrl, authUsername, bearerToken } = useAuth();
    const uploadUrl = `${APIUrl}/upload`


    const navigate = useNavigate();


    useEffect(() => {

        if (bearerToken) {

            const form = document.querySelector('form');
            form.addEventListener('submit', async (event) => {
                event.preventDefault(); // Stop standard form submission
                
                const formData = new FormData(form);
                fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${bearerToken}`,
                    },
                    body: formData
                }).then(res =>{
                    return res.json()
                }).then((res)=>{
                    if (res.error) {
                        alert(res.message)
                    } else {
                        alert("submitted!")
                        console.log(res.challengeId)
                        
                        navigate(`/archive/${res.challengeId}`)
                    }

                })
                
                
            });
        }
    }, [bearerToken])

    return (
        <div>
            <h1>Contribution    </h1>
            <form method='post' action={uploadUrl} enctype="multipart/form-data">
                <input type='file' name='file' />
                <hr />
                <label htmlFor="title">Title: </label> <input type='text' name="title" />
                <h3>Answer</h3>
                <label htmlFor="x">x: </label><input type='number' name="x" />
                <label htmlFor="y">y: </label><input type='number' name="y" />
                <hr />
                <input className='hidden' type='text' name="username" value={authUsername} />
                <input type='submit' />
            </form>
        </div>

    )
}