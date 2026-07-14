import './App.css';

import Auth from "./Auth.jsx"
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


import LandingPage from './LandingPage.jsx';
import ArchivePage from './ArchivePage.jsx';
import AdminPage from './AdminPage.jsx';
import Contribution from './ContributionPage.jsx';
import StatsPage from './StatsPage.jsx';

import Navbar from './Navbar.jsx';
import Leaderboard from './Leaderboard.jsx';
import Lamp from './Lamp.jsx';


const router = createBrowserRouter([
  { path: '/', Component: LandingPage },
  { path: '/archive/:id', Component: ArchivePage },
  { path: '/admin', Component: AdminPage },
  { path: '/contribute', Component: Contribution },
  { path: '/user/:user', Component: StatsPage },

]);

function App() {


  return (
    <div className="row">

        <div className="col-12 col-md-auto order-3 sidebar sm order-md-1">
            <Navbar router={router}/>

        </div>
        
        <main className="col-12 col-md flex-grow-1 order-1 main-content order-md-2">
            <div className="section centre-flex">
                <Auth />
            </div>
            <RouterProvider router={router} />
        </main>
        
        <div className="col-12 col-lg-auto sidebar sm order-4 order-md-3">
            <Leaderboard router={router}/>

        </div>
    </div>

    )
}
export default App
