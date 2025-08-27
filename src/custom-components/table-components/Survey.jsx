import {useState, useEffect} from "react"
import { useParams } from "react-router-dom"
import PhilsanLogo from "../../assets/philsan_logo.png"
import PhilsanTheme from "../../assets/philsan-38th-theme.png"
import { getSurvey, createSurveyResponse, getSurveyResponse, updateSurveyResponse } from "../../supabase/supabaseService"

const Survey = () => {
    const { email } = useParams()
    const [survey, setSurvey] = useState([])
    const [retake, setRetake] = useState(false)
    // const [response, setResponse] = useState({})

   

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const existingSurvey = await getSurveyResponse(email)
                const surveyData = await getSurvey()

                
                if(existingSurvey.length > 0) {
                    setRetake(true)

                    console.log("existing", existingSurvey)
                    setSurvey(existingSurvey.map((item, index) => {
                        return {
                            participant: email,
                            id: item.id,
                            question: item.question,
                            question_type: item.question_type,
                            choices: item.choices,
                            response: item.response,
                            order: item.order,
                            error: null
                        }
                    }))
                } else {
                    console.log("surveyData", surveyData)
                    setSurvey(surveyData.map((item, index) => {
                        return {
                            participant: email,
                            id: item.id,
                            question: item.question,
                            question_type: item.question_type,
                            choices: item.choices,
                            response: null,
                            order: item.order,
                            error: null
                        }
                }))
                }
            } catch (err) {
                console.error("Error fetching survey:", err)
            }
        }

        fetchSurvey()
    }, [])

    
    const handleChange = (e, id) => {
        const { value } = e.target;

        console.log("value", value)

        setSurvey((prevSurvey) =>
            prevSurvey.map((q) =>
            q.id === id
                ? { ...q, response: value, error: null } // update this question
                : q // leave others unchanged
            )
        );
    };

    const onSubmit = () => {
        const unanswered = survey.find(q => q.response === null);

        if(unanswered) {
            survey.map((item, index) => {
                if(item.response === null) {
                    setSurvey((prevSurvey) =>
                            prevSurvey.map((q) =>
                            q.id === item.id
                                ? { ...q, response: null, error: "required" } // update this question
                                : q // leave others unchanged
                            )
                        );
                    }
            })
        } else if(retake) {
            updateSurveyResponse(survey)
        } else {
            createSurveyResponse(survey)
        }
    }

    console.log("surveydata", survey)

    return (
        <div className="max-w-[1280px] my-[20px] mx-auto">
            <div className="relative pt-[50px] px-[30px] pb-[200px] shadow-xl overflow-hidden rounded-2xl bg-[linear-gradient(to_bottom,#ffffff_0%,#ffffff_60%,#CBF9B6_100%)]">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="w-[200px]">
                        <img src={PhilsanLogo} alt="" />
                    </div>
                    <h6 className="font-[Fraunces] text-[32px] text-[#1f783b] font-[700]">Survey</h6>
                </div>
                <div className="relative flex flex-col md:flex-row justify-between pt-[50px] gap-[20px] md:gap-[50px] z-[1]">
                    <div className="w-[100%] md:w-[50%]">
                        {
                            survey.map((item, index) => (
                                item.question_type === "long_text" &&
                                    <div className={`questions_text${index}`} key={"questions_text"+index}>
                                        <div className="pb-[5px]">
                                            <h6 className={`font-[600] text-[14px] md:text-[18px] ${item.error === "required" && "error-color"}`}>{item.question}</h6>
                                            <span className={`text-[10px] text-[red] ${item.error === "required" && "hidden"}`}></span>
                                        </div>
                                        <div className="pb-[10px]">
                                            <textarea 
                                                value={item.response ?? ""}
                                                onChange={(e) => handleChange(e, item.id)} name={`question_${item.id}`} 
                                                className="text-[14px] md:text-[16px] border-[#339544] border-[1px] bg-[#eaeeeb] p-[10px] rounded-md w-[100%] min-h-[120px] max-h-[120px]" 
                                            />
                                        </div> 
                                    </div>
                            ))
                        }
                    </div>
                    <div className="flex flex-col gap-[30px] w-[100%] md:w-[50%]">
                        {
                            survey.map((item, index) => (
                                item.question_type !== "long_text" &&
                                    <div className={"questions_multiple"+index} key={"questions_multiple"+index}>
                                        <div className="pb-[5px]">
                                            <h6 className={`font-[600] text-[14px] md:text-[18px] ${item.error === "required" && "error-color"}`}>{item.question}</h6>
                                            <span className={`text-[10px] text-[red] ${item.error === "required" && "hidden"}`}></span>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-[5px] md:gap-[50px]">
                                            {
                                                item.choices.map((c, inx) => (
                                                    <div key={c+"_"+inx} className="flex gap-[5px] items-center">
                                                        <input
                                                            value={c}
                                                            checked={item.response == c}   
                                                            onChange={(e) => handleChange(e, item.id)} 
                                                            className="w-[20px] h-[20px] text-[#339544] focus:ring-[#339544]" 
                                                            type="radio" 
                                                            name={`question_${item.id}`} 
                                                        />
                                                        <h6 className="text-[14px] md:text-[16px]">{c}</h6>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                            ))
                        }
                    </div>
                </div>
                <div className="relative z-[1] flex flex-col items-center justify-center pt-[100px]">
                    <button onClick={() => onSubmit()} className="w-fit px-[80px] py-[10px] bg-[#1f783b] rounded-md text-[#ffffff] cursor-pointer">Submit Survey</button>
                    <button onClick={() => onSubmit()} className="group flex gap-[20px] items-center w-fit pl-[35px] pr-[80px] py-[10px] font-[600] text-[#1f783b] cursor-pointer"><span className="text-[25px] animate-slide-x">{'\u{1F449}'}</span><span>Proceed to quiz</span></button>
                </div>
                <img className="absolute bottom-[-50px] left-[0px] opacity-[.05]" src={PhilsanTheme} alt="" />
            </div>
        </div>
    )   
}

export default Survey;