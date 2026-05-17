window.onload = () => {
    const CurrentImage = document.getElementById("current-image")
    const BACKEND = "http://localhost:3000"

    CurrentImage.src = BACKEND+"/current"
    console.log(CurrentImage.src)
}