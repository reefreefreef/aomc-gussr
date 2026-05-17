import { useEffect } from 'react';
import './App.css';

import GuessSubmission from "./GuessSubmission.jsx"
import Auth from "./Auth.jsx"
import CurrentImage from "./CurrentImage.jsx"

function App() {


  return (
    <div id="main-content" class="centre-flex">
      <div class="section centre-flex">
        <Auth />
      </div>
      <div class="section centre-flex">
        <h2>Where in the server was this image taken?</h2>
      <CurrentImage />

      </div>
      <div class="section centre-flex" id="map-section">
        <GuessSubmission />

      </div>

    </div>)
}
export default App
