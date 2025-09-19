import {useState, useEffect} from "react"
import { useParams } from "react-router-dom"
import { getSpeaker, getQuiz, createQuizResponse, updateQuizResult } from "../../supabase/supabaseService"
import PhilsanLogo from "../../assets/philsan_logo.png"
import PhilsanTheme from "../../assets/philsan-38th-theme.png"
import { Link, useNavigate } from 'react-router-dom';

const Quiz = () => {
    const [session, setSession] = useState([])
    const [quiz, setQuiz] = useState([])
    const { email } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const speakerData = await getSpeaker()
                const quizData = await getQuiz()

                if(speakerData) {
                    const grouped = speakerData.reduce((acc, item) => {
                        const session = item.session_type.trim();
                        return {
                            ...acc,
                            [session]: [...(acc[session] || []), item],
                        };
                        }, {});

                        const sessionsArray = Object.entries(grouped).map(([session, speakers]) => ({
                            session,
                            speakers,
                        }));

                        setSession(sessionsArray);
                }

                if(quizData) {
                    setQuiz(quizData.map((item) => {
                        return {
                            id: item.id,
                            speaker_id: item.speaker_id,
                            question_no: item.question_number,
                            question: item.question,
                            choices: [
                                item.choice_a,
                                item.choice_b,
                                item.choice_c,
                                item.choice_d,
                            ],
                            session: item.session_type,
                            error: false,
                            email: email,
                            choice: null,
                            choice_index: null,
                            correct_answer: item.answer
                        }
                    }))
                }

               
            } catch (err) {
                console.error("Error fetching survey:", err)
            }
        }

        fetchData()
    }, [])
    
    const handleChange = (e, question_id, question, index) => {
        const { value } = e.target;


        setQuiz((prev) => {
            // Check if this question already has a response
            const existing = prev.find((r) => r.question_id === question_id);
            const capital = index == 0 ? "A" : index == 1 ? "B" : index == 2 ? "C" : "D" 

            return prev.map((q) =>
                q.id === question_id
                    ? { 
                        ...q,
                        choice_index: capital,
                        choice: value,
                        error: false, 
                    } 
                    : q 
            )
        });
    };
    
    const onSubmit = async () => {
        const unanswered = quiz.find(q => q.choice === null);

        if(unanswered) {
            quiz.map((item, index) => {
                if(item.choice === null) {
                    setQuiz((prev) =>
                            prev.map((q) =>
                            q.id === item.id
                                ? { ...q, error: true } // update this question
                                : q // leave others unchanged
                            )
                        );
                    }
            })
        } else {
            try {
                // waits for all inserts to finish
                await createQuizResponse(quiz);

                // only runs AFTER the above resolves successfully
                await updateQuizResult(email);
            } catch (err) {
                console.error("Submission failed:", err);
            }
        }
    }

    const onNavigate = () => {
        if (email) {
            navigate("/quiz-survey/"+email) 
        }
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Scroll to bottom
    const scrollToBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    };

    console.log("quiz", quiz)

    return (
        <div className="max-w-[1280px] my-[20px] mx-auto relative">
            <div className="relative pt-[50px] px-[100px] pb-[200px] shadow-xl overflow-hidden rounded-2xl bg-[linear-gradient(to_bottom,#ffffff_0%,#ffffff_60%,#CBF9B6_100%)]">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="w-[200px]">
                        <img src={PhilsanLogo} alt="" />
                    </div>
                    <h6 className="font-[Fraunces] text-[32px] text-[#1f783b] font-[700]">Quiz</h6>
                </div>
                <div className="relative flex flex-col md:flex-row justify-between pt-[50px] gap-[20px] md:gap-[50px] z-[1]">
                    <div className="flex flex-col gap-[30px] w-[100%]">
                        {
                            session.map((item, index) => (
                                    <div className={"session"+index+item.id} key={"session"+index+item.id}>
                                        <div className="pb-[5px]">
                                            <div className="py-[1px] pl-[10px] border-l-[10px] border-[#F9B700] rounded-sm">
                                                <h5 className={`font-[600] text-[14px] md:text-[24px] text-[#1f783b]`}>{item.session}</h5>
                                            </div>
                                            {
                                                item.speakers.map((speaker, index) => (
                                                    <div className={"speaker py-[20px]"} key={"speaker"+speaker.id}>
                                                        <div className="pb-[10px]">
                                                            <h5 className={`font-[500] text-[14px] md:text-[18px] text-[#1f783b]`}><strong>Speaker:</strong> {speaker.name}</h5>
                                                        </div>
                                                        {
                                                            quiz
                                                            .filter(question => question.speaker_id === speaker.id)
                                                            .map(question => (
                                                                <div className="quiz py-[10px]" key={"quiz" + question.id}>
                                                                    <div className={`flex relative pb-[10px] font-[600] ${question.error === true && "text-[red]"}`}>
                                                                        <h6 className="absolute">{question.question_no}. </h6>
                                                                        <h6 className="pl-[20px]">{question.question}</h6>
                                                                    </div>
                                                                    {
                                                                        question.choices.map((choice, index) =>
                                                                            {
                                                                                const capital = index == 0 ? "A" : index == 1 ? "B" : index == 2 ? "C" : "D" 

                                                                                return (
                                                                                    <div key={"choice"+index} className="flex gap-[10px] pb-[10px] items-start font-[300] pl-[30px]">
                                                                                            <div className="pt-[2px]">
                                                                                                <input
                                                                                                    value={choice}   
                                                                                                    onChange={(e) => handleChange(e, question.id, question.question, index)} 
                                                                                                    className="w-[20px] h-[20px] text-[#339544] focus:ring-[#339544]" 
                                                                                                    type="radio" 
                                                                                                    name={`question_${question.id}`} 
                                                                                                />
                                                                                            </div>
                                                                                            <p>{capital}. {choice}</p>
                                                                                        </div>
                                                                                )
                                                                            } 
                                                                        )
                                                                    }
                                                                </div>
                                                            ))
                                                        }
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
                    <button onClick={() => onSubmit()} className="w-fit px-[80px] py-[10px] bg-[#1f783b] rounded-md text-[#ffffff] cursor-pointer">Submit Quiz</button>
                    <button onClick={() => onNavigate()} className="group flex gap-[20px] items-center w-fit pl-[35px] pr-[80px] py-[10px] font-[600] text-[#1f783b] cursor-pointer">
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 1L1 7L7 13" stroke="#1F773A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Back
                    </button>
                    {/* <button onClick={() => onNavigate()} className="group flex gap-[20px] items-center w-fit pl-[35px] pr-[80px] py-[10px] font-[600] text-[#1f783b] cursor-pointer"><span className="text-[25px] animate-slide-x">{'\u{1F449}'}</span><span>Proceed to survey</span></button> */}
                </div>
                <img className="absolute bottom-[-50px] left-[0px] opacity-[.05]" src={PhilsanTheme} alt="" />
            </div>
            
            <div className="flex flex-col gap-[10px] fixed bottom-[50px] right-[calc((100vw-1260px)/2)]">
                <div onClick={scrollToTop} className="p-[15px] bg-[#f6f6f6] hover:bg-[#efefef] rounded-full shadow-xl transition-all duration-200 ease">
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 30L16 2M16 2L2 16M16 2L30 16" stroke="#acc5b4" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div onClick={scrollToBottom} className="p-[15px] bg-[#f6f6f6] hover:bg-[#efefef] rounded-full shadow-xl transition-all duration-200 ease">
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 2L16 30M16 30L30 16M16 30L2 16" stroke="#acc5b4" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default Quiz;