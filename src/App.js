import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './loginpage/login';
import LLNavbar from './landlord/landlordnavbar/llnavbar';
import ReservationList from './landlord/reserve/reserve';
import Landlordhome from './landlord/landlordhome/llhome';
import Home from './tenant/homepage/home';
import Navbar from './tenant/navbar/navbar';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Homepage />} />
          
          {/* Tenant route - Add your tenant navbar here if you have one */}
          <Route path="/tenant-home" element={
            <>
              {/* <TenantNavbar /> - Uncomment when you have a tenant navbar */}
              <Home />
            </>
          } />
          
          {/* Landlord routes */}
          <Route path="/landlord-home" element={
            <>
              <LLNavbar />
              <Landlordhome />
            </>
          } />
          <Route path="/reservations" element={
            <>
              <LLNavbar />
              <ReservationList />
            </>
          } />
          <Route path="/landlord-profile" element={
            <>
              <LLNavbar />
              <div>Landlord Profile Page</div>
            </>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;