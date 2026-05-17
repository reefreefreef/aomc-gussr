window.onload = () => {
    const BACKEND = "http://localhost:3000"
    const CurrentImage = document.getElementById("current-image")

    CurrentImage.src = BACKEND+"/current"
    console.log(CurrentImage.src)
}