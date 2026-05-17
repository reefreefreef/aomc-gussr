import { useEffect, useState } from 'react';
import { useAuth } from './API';

function AuthBar() {
    const { submitCreds, bearerToken, authUsername, logout } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    if (!bearerToken) {
        return <span>

                <input type="text" placeholder='username' id="standard-basic" label="Username" variant="standard"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                <input type="text" placeholder='password' id="standard-basic" label="Password" variant="standard"
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    />

                <button variant="contained"
                    onClick={() => submitCreds(username, password)}
                    >Login</button>
        
            </span>
    } else {
        return <span>
                <span id="loggedIn">Logged in as {authUsername}</span>
                <button id="logout"
                onClick={()=>logout()}
                >Logout</button>
            </span>
    }
    
            
}

export default function Auth() {


    return (
        <div >
            
            <AuthBar />
            

        </div>
    )
}