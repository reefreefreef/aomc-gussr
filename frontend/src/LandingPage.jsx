import GuessSubmission from "./GuessSubmission.jsx"
import CurrentImage from "./CurrentImage.jsx"
import { useEffect } from "react";

//https://stackoverflow.com/questions/8211744/convert-time-interval-given-in-seconds-into-more-human-readable-form
function millisecondsToStr(milliseconds) {
  // TIP: to find current time in milliseconds, use:
  // var  current_time_milliseconds = new Date().getTime();

  function numberEnding(number) {
    return (number > 1) ? 's' : '';
  }

  var temp = Math.floor(milliseconds / 1000);
  var years = Math.floor(temp / 31536000);
  if (years) {
    return years + ' year' + numberEnding(years);
  }
  //TODO: Months! Maybe weeks? 
  var days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
    return days + ' day' + numberEnding(days);
  }
  var hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    return hours + ' hour' + numberEnding(hours);
  }
  var minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    return minutes + ' minute' + numberEnding(minutes);
  }
  var seconds = temp % 60;
  if (seconds) {
    return seconds + ' second' + numberEnding(seconds);
  }
  return 'less than a second'; //'just now' //or other string you like;
}



export default function LandingPage() {
  useEffect(() => {
    let previousTime = Infinity
    setInterval(() => {

      const rotationInterval = (1000 * 60) * 30

      const millisecondsLeft = rotationInterval - (new Date().getTime() % rotationInterval)

      if (millisecondsLeft>previousTime) {
        window.location.reload()
      }
      previousTime = millisecondsLeft

      let timeEle = document.getElementById("timeLeft")
      if (timeEle!=undefined) timeEle.textContent = `${millisecondsToStr(millisecondsLeft)} remaining`
    }, 10);

  }, [])
  return (
    <div id="main-content" className="centre-flex">
      <div className="section centre-flex">
        <h2>Where in the server was this image taken?</h2>
        <h4 id="timeLeft"></h4>
        <CurrentImage />


      </div>
      <div className="section centre-flex" id="map-section">
        <GuessSubmission />

      </div>

    </div>
  )
}
