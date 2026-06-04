import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from 'react';
import { useAuth } from './API';

import WbIncandescentIcon from '@mui/icons-material/WbIncandescent';


export default function Lamp() {

    useEffect(()=>{

        var socket = io("https://pi.warmsandybeaches.net", {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        });
        
        socket.on('connect', function() {
            console.log("socket connected")
        });

        const button = document.getElementById('button');
        
        socket.on('state_update', function(e) {
            console.log("state updated to ", e)
            button.style.webkitFilter = e.state!="on"?"invert()":""
        });


        
        button.addEventListener('click', async _ => {
            const response = await fetch('https://pi.warmsandybeaches.net/blink', {method: 'post',});
        });
    }, [])

    return (
        <div style={{
            float: "right"
        }}>
            <div id="button">
                <WbIncandescentIcon />
    
            </div>
        </div>
        )
}