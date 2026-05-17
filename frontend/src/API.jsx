import { useState, useEffect, createContext, useContext } from "react";



const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [bearerToken, setBearerToken] = useState(null);
    const [authUsername, setAuthUsername] = useState(null);
    const APIUrl = "http://localhost:3000/api"

    const submitCreds = function (username, password) {
        console.log("submitting ", username, password)

        fetch(APIUrl + "/login",
            {
                method: "POST",
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({
                    "username": username,
                    "password": password
                })
            }).then((res) => {
                return res.json();
            }).then((res) => {
                if (res.error) {
                    alert(res.message)
                } else if (res.token) {
                    const token = res.token
                    setBearerToken(token)
                    setAuthUsername(res.username)
                    localStorage.setItem("creds", JSON.stringify({
                        token: token,
                        username: res.username,
                    }))
                }
            })
    }
    const logout = function () {
        setBearerToken(null)
        localStorage.setItem("creds", null)
        console.log("hopefully logged out", bearerToken)
    }
    const submitGuess = function (selectedCoords) {
        console.log("submitting", bearerToken)
        if (!bearerToken) {
            console.error("no auth token")
            return 0
        }
        fetch(APIUrl + "/submitGuess",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    'Authorization': `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({
                    "guess": selectedCoords,
                })
            }).then((res) => {
                return res.json();
            }).then((res) => {
                if (res.error) {
                    alert(res.message)
                } else {
                    console.log(res)
                }
            })
    }
    const getGuess = function (challenge, next) {
        if (!bearerToken) {
            console.error("no auth token")
            return 0
        }
        fetch(APIUrl + "/getGuess",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    'Authorization': `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({
                })
            }).then((res) => {
                return res.json();
            }).then((res) => {
                if (res.error) {
                    alert(res.message)
                } else {
                    console.log(res)
                    next(res)
                }
            })
    }
    const getChallenge = function (challenge, next) {
        fetch(APIUrl + "/getChallenge",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    'Authorization': `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({
                    challenge: challenge,
                })
            }).then((res) => {
                return res.json();
            }).then((res) => {
                if (res.error) {
                    alert(res.message)
                } else {
                    console.log(res)
                    next(res)
                }
            })
    }
    const getChallenges = function (next) {
        fetch(APIUrl + "/getChallenges",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                }
            }).then((res) => {
                return res.json();
            }).then((res) => {
                if (res.error) {
                    alert(res.message)
                } else {
                    console.log(res)
                    next(res)
                }
            })
    }

    useEffect(() => {
        var storedToken = localStorage.getItem("creds")

        if (storedToken != null) {
            try {
                storedToken = JSON.parse(storedToken)
            } catch {
                console.error("malformed stored token")
            }
            if (storedToken != null) {
                console.log(storedToken)
                setBearerToken(storedToken.token)
                setAuthUsername(storedToken.username)

            }
        }
    })


    return (
        <AuthContext.Provider value={{ APIUrl, bearerToken, getChallenges, getChallenge, submitCreds, logout, submitGuess, getGuess, authUsername }}>
            {children}
        </AuthContext.Provider>
    )
}