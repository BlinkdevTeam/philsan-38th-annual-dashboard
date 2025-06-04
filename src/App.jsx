import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LandingPage from './custom-components/LandingPage'
import Login from './custom-components/table-components/LogIn'
import Sponsors from './Config/Sponsors'
import { Routes, Route, useParams } from 'react-router-dom'
import './App.css'


function PasswordRoute() {
  const { password } = useParams();
  const filteredSponsor = Sponsors.find((i) => i.password === password);

  if (filteredSponsor) {
    return <LandingPage sponsor={filteredSponsor}/>;
  }

  return <>Invalid sponsor or link.</>;
}

function App() {
  return (
    <Routes>
      <Route path="/:password" element={<PasswordRoute />} />
      <Route path="/login" element={<Login/>} />
       {/* Catch-all route for 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App
