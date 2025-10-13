import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './loginpage/login';
import LLNavbar from './landlord/landlordnavbar/llnavbar';
import ReservationList from './landlord/reserve/reserve';
import Landlordhome from './landlord/landlordhome/llhome';
import Home from './tenant/homepage/home';
import Navbar from './tenant/navbar/navbar';
import Liked from './tenant/liked/liked';
import AddBoardingHouse from './landlord/addbh/addbh';
import TenantProfile from './tenant/profile/profile'; // Import the profile component


function App() {
  // Example: This would come from your authentication context or state management
  // For now, you can use this sample data or pass actual user data from your auth system
  const tenantUserData = {
    profileImage: 'https://via.placeholder.com/150',
    firstName: 'Juan',
    middleName: 'Santos',
    lastName: 'Dela Cruz',
    civilStatus: 'Single',
    age: '22',
    gender: 'Male',
    dateOfBirth: '2002-05-15',
    permanentAddress: '123 Main Street, Cebu City, Philippines',
    category: 'student',
    emergencyContact: {
      fullName: 'Maria Dela Cruz',
      contactNo: '09123456789',
      address: '123 Main Street, Cebu City, Philippines'
    }
  };

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Homepage />} />
          
          {/* Tenant routes with navbar */}
          <Route path="/tenant-home" element={
            <>
              <Navbar />
              <Home />
            </>
          } />
          
          <Route path="/liked" element={
            <>
              <Navbar />
              <Liked />
            </>
          } />
          
          {/* Tenant Profile Route */}
          <Route path="/user-profile" element={
            <>
              <Navbar />
              <TenantProfile tenantData={tenantUserData} />
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
          <Route path="/add-boarding-house" element={<AddBoardingHouse />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;