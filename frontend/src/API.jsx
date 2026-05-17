import { useState, useEffect, createContext, useContext } from "react";



const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [bearerToken, setBearerToken] = useState(null);
    const [authUsername, setAuthUsername] = useState(null);
    const APIUrl = "https://pi.warmsandybeaches.net/api"

    const submitCreds = function(username, password) {
        console.log("submitting ", username, password)

        fetch(APIUrl+"/login", 
            {
                method: "POST",
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({
                    "username": username,
                    "password": password
                })
            }).then((res)=>{
                return res.json();
            }).then((res)=>{
                if (res.error) {
                    alert(res.message)
                } else if (res.token) {
                    const token = res.token
                    setBearerToken(token)
                    setAuthUsername(res.username)
                    localStorage.setItem("creds", JSON.stringify({
                        token: token,
                        username:res.username,
                    }))
                }
            })
    }
    const logout = function() {
        setBearerToken(null)
        localStorage.setItem("creds", null)
        console.log("hopefully logged out", bearerToken)
    }
    const submitGuess = function(selectedCoords) {
        fetch(APIUrl+"/submitGuess", 
            {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "Access-Control-Allow-Origin": "*",
                    'Authorization': `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({
                    "guess":selectedCoords,
                    "challenge":1
                })
            }).then((res)=>{
                return res.json();
            }).then((res)=>{
                if (res.error) {
                    alert(res.message)
                } else {
                    console.log(res)
                }
            })
    }
    const getGuess = function(challenge) {
        fetch(APIUrl+"/submitGuess", 
            {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "Access-Control-Allow-Origin": "*",
                    'Authorization': `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({
                    "challenge":1
                })
            }).then((res)=>{
                return res.json();
            }).then((res)=>{
                if (res.error) {
                    alert(res.message)
                } else {
                    console.log(res)
                }
            })
    }

    useEffect(() => {
        var storedToken = localStorage.getItem("creds")
        
        if (storedToken!=null) {
            try {
                storedToken = JSON.parse(storedToken)
            } catch {
                console.error("malformed stored token")
            } 
            if (storedToken!=null) {
                console.log(storedToken)
                setBearerToken(storedToken.token)
                setAuthUsername(storedToken.username)

            }
        }
    })


    return (
        <AuthContext.Provider value={{ APIUrl, bearerToken, submitCreds, logout, submitGuess, authUsername}}>
            {children}
        </AuthContext.Provider>
    )
}