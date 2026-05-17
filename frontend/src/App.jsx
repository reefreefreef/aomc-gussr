import { useEffect } from 'react';
import './App.css';

import AlgotMap from "./AlgotMap.jsx"
import Auth from "./Auth.jsx"
import CurrentImage from "./CurrentImage.jsx"

function App() {


  return (
  <div>
    <Auth />
    <hr />
    <CurrentImage />
    
  </div>)
}
//<AlgotMap />
export default App
