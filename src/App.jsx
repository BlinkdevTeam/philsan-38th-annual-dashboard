import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LandingPage from './custom-components/LandingPage'
import Login from './custom-components/table-components/LogIn'
import QrCode from './custom-components/table-components/QrCode'
import Sponsors from './Config/Sponsors'
import { Routes, Route, useParams } from 'react-router-dom'
import { getSponsorByPassword } from './supabase/supabaseService'
import './App.css'

function PasswordRoute() {
  const { password } = useParams()
  const [sponsor, setSponsor] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchSponsor = async () => {
      const res = await getSponsorByPassword(password)
      
      if (res.length > 0) {
        setSponsor(res)
      } else {
        setError(true)
      }
    }

    fetchSponsor()
  }, [password])

  if (error) {
    return <div>Invalid code. <a href="/login">Go back</a></div>
  }

  if (!sponsor) {
    return <div>Loading...</div>
  }

  return <LandingPage sponsor={sponsor} />
}


function App() {
  const { password } = useParams();
  
  return (
    <Routes>
      <Route path="/:password" element={<PasswordRoute  />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/" element={<Login/>} />
      <Route path="/download-qr" element={<QrCode/>} />
       {/* Catch-all route for 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App
