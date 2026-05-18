import './App.css';

import Auth from "./Auth.jsx"
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


import LandingPage from './LandingPage.jsx';
import ArchivePage from './ArchivePage.jsx';
import AdminPage from './AdminPage.jsx';

import Navbar from './Navbar.jsx';
import Leaderboard from './Leaderboard.jsx';


const router = createBrowserRouter([
  { path: '/', Component: LandingPage },
  { path: '/archive', Component: ArchivePage },
  { path: '/admin', Component: AdminPage },

]);

function App() {


  return (
    <div className="wrapper">

        <div className="sidebar">
            <Navbar router={router}/>

        </div>
        
        <main className="main-content">
            <div className="section centre-flex">
                <Auth />
            </div>
            <RouterProvider router={router} />
        </main>
        
        <div className="sidebar">
            <Leaderboard />

        </div>
    </div>

    )
}
export default App
