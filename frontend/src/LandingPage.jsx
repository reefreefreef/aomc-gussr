import GuessSubmission from "./GuessSubmission.jsx"
import CurrentImage from "./CurrentImage.jsx"

export default function LandingPage() {
    return (
        <div id="main-content" class="centre-flex">
      <div class="section centre-flex">
        <h2>Where in the server was this image taken?</h2>
      <CurrentImage />

      </div>
      <div class="section centre-flex" id="map-section">
        <GuessSubmission />

      </div>

    </div>
    )
}