import { useState, useEffect, createContext, useContext } from "react";



const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [bearerToken, setBearerToken] = useState(null);
    const [authUsername, setAuthUsername] = useState(null);
    const [navBarUpdate, setNavBarUpdate] = useState(null);
    const APIUrl = "http://localhost:3000/api" //"https://guessr.warmsandybeaches.net/api"

    const submitCreds = function (username, password) {
        

        fetch(APIUrl + "/login",
            {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    "username": username,
                    "password": password
                })
            }).then((res) => {
                return res.json();
            }).then((res) => {
                if (res.error) {
                    alert(res.message)
                    logout()
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
        
    }
    const submitGuess = function (selectedCoords) {
        
        if (bearerToken) {
        fetch(APIUrl + "/submitGuess",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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
                    logout()
                } else {
                    
                }
            })
        }
    }
    const getGuess = function (challenge, next) {
        if (bearerToken) {
        fetch(APIUrl + "/getGuess",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({
                })
            }).then((res) => {
                return res.json();
            }).then((res) => {
                if (res.error) {
                    alert(res.message)
                    logout()
                } else {
                    
                    next(res)
                }
            })
        }
    }
    const getChallenge = function (challenge, next) {
        if (bearerToken) {
        fetch(APIUrl + "/getChallenge",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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
                    logout()
                } else {
                    
                    next(res)
                }
            })
        }
    }
    const getChallenges = function (next) {
        
        if (bearerToken) {
            fetch(APIUrl + "/getChallenges",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${bearerToken}`,

                        
                    }
                }).then((res) => {
                    return res.json();
                }).then((res) => {
                    if (res.error) {
                        alert(res.message)
                        logout()
                    } else {
                        
                        next(res)
                    }
                })
            }
    }
    const getCurrent = function (next) {
        fetch(APIUrl + "/getCurrent",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    
                }
            }).then((res) => {
                return res.json();
            }).then((res) => {
                if (res.error) {
                    alert(res.message)
                } else {
                    
                    next(res)
                }
            })
    }
    const getScore = function (user, next) {
        fetch(APIUrl + "/scores/getScore?user="+user,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    
                }
            }).then((res) => {
                return res.json();
            }).then((res) => {
                if (res.error) {
                    alert(res.message)
                } else {
                    next(res)
                }
            })
    }
    const getLeaderboard = function (next) {
        fetch(APIUrl + "/scores/getLeaderboard",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    
                    
                }
            }).then((res) => {
                return res.json();
            }).then((res) => {
                if (res.error) {
                    alert(res.message)
                } else {
                    next(res)
                }
            })
    }

    const exeSQL = function (sql, next) {
        fetch(APIUrl + "/admin/rawSQL",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({
                    sql: sql,
                })
            }).then((res) => {
                return res.json();
            }).then((res) => {
                if (res.error) {
                    alert(res.message)
                } else {
                    next(res)
                }
            })
    }
    const setChallenge = function (id, next) {
        fetch(APIUrl + "/admin/setChallenge",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({
                    challenge: id,
                })
            }).then((res) => {
                return res.json();
            }).then((res) => {
                if (res.error) {
                    alert(res.message)
                } else {
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
                
                setBearerToken(storedToken.token)
                setAuthUsername(storedToken.username)

            }
        }
    })


    return (
        <AuthContext.Provider value={{ APIUrl, bearerToken, setChallenge, exeSQL, getScore, getLeaderboard, getCurrent, getChallenges, getChallenge, submitCreds, logout, submitGuess, getGuess, authUsername, navBarUpdate, setNavBarUpdate }}>
            {children}
        </AuthContext.Provider>
    )
}