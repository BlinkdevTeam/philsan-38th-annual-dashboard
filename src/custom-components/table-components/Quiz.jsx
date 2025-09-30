import {useState, useEffect, useRef} from "react"
import { useParams } from "react-router-dom"
import { getSpeaker, getQuiz, createQuizResponse, updateQuizResult } from "../../supabase/supabaseService"
import PhilsanLogo from "../../assets/philsan_logo.png"
import PhilsanTheme from "../../assets/philsan-38th-theme.png"
import { Link, useNavigate } from 'react-router-dom';

const Quiz = () => {
    const navigate = useNavigate()
    const { email } = useParams()

    const [session, setSession] = useState([])
    const [quiz, setQuiz] = useState([])
    const [spinner, setSpinner] = useState(false)
    const [buttonTitle, setButtontitle] = useState("Submit Quiz")
    const [error, setError] = useState(false)
    const [openSpeaker, setOpenSpeaker] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const speakerData = await getSpeaker()
                const quizData = await getQuiz()

                if(speakerData) {
                    const grouped = speakerData.reduce((acc, item) => {
                        const session_name = item.session_name.trim();

                        return {
                            ...acc,
                            [session_name]: [...(acc[session_name] || []), item],
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
    
    const handleAccordion = (id) => {
        setOpenSpeaker(openSpeaker === id ? null : id);
    }

    const handleChange = (e, question_id, question, index) => {
        const { value } = e.target;


        setQuiz((prev) => {
            // Check if this question already has a response

            const capital = index == 0 ? "A" : index == 1 ? "B" : index == 2 ? "C" : "D" 

            return prev.map((q) =>
                (
                    q.id === question_id
                        ? { 
                            ...q,
                            choice_index: capital,
                            choice: value,
                            error: false, 
                        } 
                        : q  
                )   
            )
        });
    };

    const verifySubmission = (session, quiz) => {
        // --- 1. Check plenary ---
        const plenary = session.find(s => s.session === "PLENARY");

        if (plenary) {
            const plenarySpeakers = plenary.speakers.map(s => s.id);

            // all quiz for plenary speakers
            const plenaryQuestions = quiz.filter(q => plenarySpeakers.includes(q.speaker_id));

            const hasUnansweredPlenary = plenaryQuestions.some(q => !q.choice_index || q.choice_index === "");
            
            if (hasUnansweredPlenary) {
                return { valid: false, reason: "Please complete all plenary questions." };
            }
        }

        // --- 2. Check breakout minimum 4 completed speakers ---
        const breakout = session.filter(s => s.session.startsWith("BREAK-OUT"));

        // track fully completed speakers
        let completedSpeakers = 0;

        breakout.forEach(b => {
            b.speakers.forEach(speaker => {
            const speakerQuestions = quiz.filter(q => q.speaker_id === speaker.id);
            const allAnswered = speakerQuestions.length > 0 && speakerQuestions.every(q => q.choice_index && q.choice_index !== "");
            if (allAnswered) {
                completedSpeakers++;
            }
            });
        });

        if (completedSpeakers < 4) {
            return { valid: false, reason: "Please complete at least 4 breakout speakers' quizzes." };
        }

        // --- Passed all checks ---
        return { valid: true };
        };

    
    const onSubmit = async () => {
        const unanswered = quiz.find(q => q.choice === null);

        setSpinner(true)

        const result = verifySubmission(session, quiz);

        if (!result.valid) {
            alert(result.reason);
            setError(true)
            setSpinner(false)
        } else {
            setError(false)

            try {
                // waits for all inserts to finish
                await createQuizResponse(quiz);

                // only runs AFTER the above resolves successfully
                await updateQuizResult(email);
            } catch (err) {
                console.error("Submission failed:", err);
            } finally {
                setButtontitle("Quiz Completed")
                setSpinner(false); // always runs, success or fail
                onNavigate();
            }
        }

        // if(unanswered) {
        //     setError(true)

        //     quiz.map((item, index) => {
        //         if(item.choice === null) {
        //             setQuiz((prev) =>
        //                     prev.map((q) =>
        //                     q.id === item.id
        //                         ? { ...q, error: true } // update this question
        //                         : q // leave others unchanged
        //                     )
        //                 );
        //             }
        //     })
        // } else {
        //     setError(false)

        //     try {
        //         // waits for all inserts to finish
        //         await createQuizResponse(quiz);

        //         // only runs AFTER the above resolves successfully
        //         await updateQuizResult(email);
        //     } catch (err) {
        //         console.error("Submission failed:", err);
        //     } finally {
        //         setButtontitle("Quiz Completed")
        //         setSpinner(false); // always runs, success or fail
        //         onNavigate();
        //     }
        // }
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


    return (
        <div className="max-w-[1280px] my-[20px] mx-auto relative">
            <div className="relative pt-[50px] px-[20px] md:px-[100px] pb-[200px] shadow-xl overflow-hidden rounded-2xl bg-[linear-gradient(to_bottom,#ffffff_0%,#ffffff_60%,#CBF9B6_100%)]">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="w-[200px]">
                        <img src={PhilsanLogo} alt="" />
                    </div>
                    <div className="flex flex-col items-end">
                        <h6 className="font-[Fraunces] text-[32px] text-[#1f783b] font-[700]">Quiz</h6>
                        <div className="flex gap-[20px]">
                            {
                                session.map((item, index) => (
                                    <div className="" key={`session-nav-${index}`}>
                                        <p>{index !== 0 ? `Session ${index}` : "Plenary"}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="relative flex flex-col md:flex-row justify-between pt-[50px] gap-[20px] md:gap-[50px] z-[1]">
                    <div className="flex flex-col gap-[30px] w-[100%]">
                        {
                            session.map((item, index) => (
                                    <div className={"shadow-lg pt-[10px] pb-[20px] bg-[#ffffff]"} key={"session"+index+item.id}>
                                        <div className="pb-[5px]">
                                            <div className="flex justify-between items-center py-[7px] px-[0px] lg:px-[20px] rounded-sm shadow-xl bg-[#ffffff]">
                                                <h5 className={`font-[600] text-[14px] md:text-[24px] text-[#1f783b]`}>{item.session}</h5>
                                            </div>
                                            {
                                                item.speakers.map((speaker, index) => 
                                                    {
                                                        const speakerId = `session-${speaker.id}-${index}`;
                                                        const isOpen = openSpeaker === speakerId;
                                                        const quizChoiceLength = quiz.filter(question => question.speaker_id === speaker.id && question.choice === null).length
                                                        const quizLength = quiz.filter(question => question.speaker_id === speaker.id).length

                                                        return (
                                                            // accordion
                                                            <div className={`speaker px-[0px] lg:px-[40px] bg-[#fafafa]`} key={"speaker"+speaker.id}>
                                                                <div onClick={(e) => handleAccordion(speakerId)} className="flex justify-between items-center py-[10px] border-[#e8e8e8] border-b-[2px]">
                                                                    <h5 className={`font-[500] text-[14px] md:text-[18px] text-[#1f783b]`}><strong>Speaker:</strong> {speaker.name}</h5>
                                                                    {quizChoiceLength === 0 ?
                                                                        <p className="text-[12px] text-[#f9b700] block md:hidden">Complete</p> :
                                                                        <div className="flex text-[12px] text-[#9f9f9f] w-[25px] md:w-auto block md:hidde">
                                                                            <p>{quizChoiceLength} /</p>
                                                                            <p>{quizLength}</p>
                                                                        </div>
                                                                    }
                                                                    {/* arrow */}
                                                                    <div className="flex items-center gap-[20px]">
                                                                        {quizChoiceLength === 0 ?
                                                                            <p className="text-[12px] text-[#f9b700] hidden md:block">Complete</p> :
                                                                            <div className="flex text-[12px] text-[#9f9f9f] w-[25px] md:w-auto hidden md:block">
                                                                                <p>{quizChoiceLength} /</p>
                                                                                <p>{quizLength}</p>
                                                                            </div>
                                                                        }
                                                                        <div 
                                                                            className={`w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent transition-transform duration-300 ${
                                                                            isOpen ? "rotate-180 border-t-[#78a987]" : "border-t-[#78a987]"
                                                                            }`}
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className={`transition-all duration-500 bg-[#ebebeb] overflow-hidden ${
                                                                        isOpen ? "max-h-[1000px] py-[10px] overflow-y-scroll" : "max-h-0 overflow-hidden"
                                                                    }`}
                                                                >   
                                                                    {
                                                                        quiz
                                                                        .filter(question => question.speaker_id === speaker.id)
                                                                        .map(question => {
                                                                            return (
                                                                                <div className="quiz py-[10px] px-[20px]" key={"quiz" + question.id}>
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
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                            }
                                        </div>
                                    </div>
                            ))
                        }
                    </div>
                </div>
                <div className="relative z-[1] flex flex-col items-center justify-center pt-[100px]">
                    {error &&
                        <span className="text-[red]">Please answer all questions</span>
                    }
                    {spinner ? 
                        <svg className="animate-spin h-10 w-10 text-[#1f783b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg> : 
                        <button onClick={() => onSubmit()} className="w-fit px-[80px] py-[10px] bg-[#1f783b] rounded-md text-[#ffffff] cursor-pointer">{buttonTitle}</button>
                    }
                    <button onClick={() => onNavigate()} className="group flex gap-[20px] items-center w-fit pl-[35px] pr-[80px] py-[10px] font-[600] text-[#1f783b] cursor-pointer">
                        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 1L1 7L7 13" stroke="#1F773A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Back
                    </button>
                    {/* <button onClick={() => onNavigate()} className="group flex gap-[20px] items-center w-fit pl-[35px] pr-[80px] py-[10px] font-[600] text-[#1f783b] cursor-pointer"><span className="text-[25px] animate-slide-x">{'\u{1F449}'}</span><span>Proceed to survey</span></button> */}
                </div>
                <img className="absolute bottom-[-50px] left-[0px] opacity-[.05]" src={PhilsanTheme} alt="" />
            </div>
            
            <div className="fixed bottom-[50px] right-[calc((100vw-1260px)/2)]">
                <div className="flex flex-col gap-[10px]">
                    <div onClick={scrollToTop} className="p-[15px] bg-[#f6f6f6] hover:bg-[#efefef] rounded-full shadow-xl transition-all duration-200 ease">
                        <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 30L16 2M16 2L2 16M16 2L30 16" stroke="#acc5b4" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div onClick={scrollToBottom} className="p-[15px] bg-[#f6f6f6] hover:bg-[#efefef] rounded-full shadow-xl transition-all duration-200 ease">
                        <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 2L16 30M16 30L30 16M16 30L2 16" stroke="#acc5b4" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Quiz;