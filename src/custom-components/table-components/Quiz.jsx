import {useState, useEffect} from "react"
import { useParams } from "react-router-dom"
import { getSpeaker } from "../../supabase/supabaseService"
import PhilsanLogo from "../../assets/philsan_logo.png"
import PhilsanTheme from "../../assets/philsan-38th-theme.png"

const Quiz = () => {
    const { email } = useParams()
    const [speaker, setSpeaker] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const existingSurvey = await getSurveyResponse(email)
                const speakerData = await getSpeaker()

               
            } catch (err) {
                console.error("Error fetching survey:", err)
            }
        }

        fetchData()
    }, [])

    
    return (
        <div>

        </div>
    )
}

export default Quiz;