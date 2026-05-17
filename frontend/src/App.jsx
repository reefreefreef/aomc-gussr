import './App.css';

import Auth from "./Auth.jsx"
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


import LandingPage from './LandingPage.jsx';
import ArchivePage from './ArchivePage.jsx';

const router = createBrowserRouter([
  { path: '/', Component: LandingPage },
  { path: '/archive', Component: ArchivePage },

]);

function App() {


  return (
    <div>
      <div class="section centre-flex">
        <Auth />
      </div>
      <RouterProvider router={router} />

    </div>

    )
}
export default App
