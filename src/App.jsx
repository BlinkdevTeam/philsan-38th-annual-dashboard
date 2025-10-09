import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LandingPage from './custom-components/LandingPage'
import Login from './custom-components/table-components/LogIn'
import QrCode from './custom-components/table-components/QrCode'
import SurveyLogin from './custom-components/table-components/SurveyLogin'
import Survey from './custom-components/table-components/Survey'
import Quiz from './custom-components/table-components/Quiz'
import QuizorSurvey from './custom-components/table-components/QuizorSurvey'
import CertificateViewer from './custom-components/table-components/CertificateViewer'
import ForReports from './custom-components/table-components/ForReports'
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
      <Route path="/sponsor/:password" element={<PasswordRoute  />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/" element={<Login/>} />
      <Route path="/download-qr" element={<QrCode/>} />
      <Route path="/quiz-survey-login" element={<SurveyLogin/>} />
      <Route path="/quiz-survey/:email" element={<QuizorSurvey/>} />
      <Route path="/survey/:email" element={<Survey/>} />
      <Route path="/quiz/:email" element={<Quiz/>} />
      <Route path="/certificate/:email" element={<CertificateViewer/>} />
      <Route path="/for-reports/:email" element={<ForReports/>} />
       {/* Catch-all route for 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App
