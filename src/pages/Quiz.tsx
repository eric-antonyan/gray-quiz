import React, {useEffect, useState} from 'react';
import bg from "../assets/img/background.jpg";
import {AnimatePresence, motion} from "framer-motion";
import defaultUser from "../assets/img/default_user.png"
import axios from "axios";
import {Link} from "react-router-dom";

type Question = {
    task: string;
    answers: string[];
    correct: number;
    group: string;
}

const Quiz = () => {
    const [questionIndex, setQuestionIndex] = useState(-1);
    const [answer, setAnswer] = useState<string | null>("");
    const [answered, setAnswered] = useState(false);
    const [clicked, setClicked] = useState("");
    const [userData, setUserData] = useState<any>(null);
    const [questions, setQuestions] = useState<Question[]>([]);

    const fetchLevel = async () => {
        if (questions.length > 0 && questionIndex < questions.length) {
            const group = questions[questionIndex]?.group;
            if (group) {
                try {
                    const response = await axios.get(`https://gray-server.vercel.app/levels/${userData.id}/${group}`);
                    console.log(response.data);
                    setQuestionIndex(response.data.level as number);
                } catch (error) {
                    console.error("Error fetching level:", error);
                }
            }
        }
    };

    useEffect(() => {
        if ((window as any).Telegram) {
            const tg = (window as any).Telegram.WebApp;
            const user = tg.initDataUnsafe.user;

            const fetchQuestions = async () => {
                const response = await axios.get("https://gray-server.vercel.app/question");
                setQuestions(response.data)
            }

            fetchQuestions()


            if (user) {
                const fetchData = async () => {
                    const response = await axios.get(`https://gray-server.vercel.app/users/${user.id}`)
                    console.log(response.data)
                    if ((response as any).data.id) {
                        setUserData(() => {
                            return response.data
                        })

                    }
                }

                const render = async  () => {

                    await fetchData()
                }

                render()
            }
        }
    }, []);
    const setLevel = async () => {
        const response = await axios.get(`https://gray-server.vercel.app/levels/${userData.id}/${questions[questionIndex].group}/${questionIndex + 1}`)
        setQuestionIndex(parseInt(response.data.level))
    }

    const setLevelDefault = async () => {
        const response = await axios.get(`https://gray-server.vercel.app/levels/${userData.id}/${questions[questionIndex].group}/${questionIndex}`)
        setQuestionIndex(parseInt(response.data.level))
    }

    useEffect(() => {
        if (questionIndex !== -1) {
            setLevelDefault()
        }
    }, [userData, questionIndex]);

    useEffect(() => {
        if (questions.length > 0 && questionIndex !== 1 && questions[questionIndex]) {
            if (answer === questions[questionIndex].answers[questions[questionIndex].correct]) {
                handleBalance();
            }


            fetchLevel()


        }
    }, [answer, questions, questionIndex]);

    const handleBalance = async () => {
        await axios.get(`https://gray-server.vercel.app/users/${userData.id}/plus`);
    }


    const handleAnswer = (checkedAnswer: string) => {
        setClicked(`${checkedAnswer}:true`)
        setTimeout(async () => {
            if (answer === "") {
                setAnswer(checkedAnswer);
            } else {
                setAnswer(checkedAnswer);
            }
            handleContinue()
        }, 3000)
    };

    const handleReset = () => {
        setAnswered(false);
        setAnswer("");
        setClicked("")
    };

    const handleContinue = async () => {
        setAnswered(true);
        setTimeout(async () => {
            await setLevel();
            handleReset();
        }, 3000)
    };

    return (
        <AnimatePresence>
            {
                userData ? (
                    <div style={{
                        background: `url(${bg})`,
                        backdropFilter: "brightness(0.3)"
                    }} className='flex flex-col h-screen bg-cover w-full mx-auto'>
                        <div className='text-white p-5 bg-black flex justify-between items-center'>
                            <h1 className='font-bold text-2xl'>Gray<span className='text-red-500'>Quizz</span></h1>
                            <Link to={"/account"}>
                                <div className='flex gap-2 items-center bg-white text-sm p-2 rounded-2xl'>
                                    <p className='font-bold text-black'>@{userData.username}</p>
                                    <img src={userData.photo_url ? userData.photo_url : defaultUser}
                                         className='w-[30px] aspect-square object-cover rounded-full' alt=""/>
                                </div>
                            </Link>
                        </div>


                        <div style={{
                            backdropFilter: "brightness(0.3)",
                        }} className='w-full overflow-hidden'>
                            <h1 className='text-white text-center my-5 font-bold'><span
                                className='text-4xl'>{questions.length} / </span><span
                                className='text-2xl'>{questionIndex + 1}</span></h1>
                            <div className='flex px-5'>
                                <motion.div className='h-[3px] rounded-full bg-white my-5'
                                            animate={{width: 100 / (questions.length - questionIndex) + "%"}}></motion.div>
                            </div>
                            <motion.div initial={{x: 0}}
                                        animate={{x: -(100 / (questions.length / questionIndex)) + "%"}}
                                        transition={{
                                            duration: 0.25,
                                            type: 'tween'
                                        }} className='flex' style={{width: questions.length * 100 + "%"}}>
                                {
                                    questions && (
                                        questions.map(({correct, answers, task}, i) => (
                                            <motion.div
                                                key={i}
                                                transition={{type: "spring", stiffness: 300, damping: 30}}
                                                className='flex flex-col h-screen p-5 flex-1'>
                                                <h1 className='text-lg font-bold text-center text-white'>{i + 1}. {task}</h1>
                                                <div className='flex flex-col gap-3 mt-11 w-full'>
                                                    {
                                                        answers.map((questionAnswer, index) => (
                                                            answered ? (
                                                                <motion.button
                                                                    key={index}
                                                                    className={`font-bold ${index !== correct ? "bg-red-500 text-white active:bg-red-200" : "bg-green-500 text-white active:bg-green-200"} p-3 rounded-2xl`}
                                                                >
                                                                    {questionAnswer}
                                                                </motion.button>
                                                            ) : (
                                                                <motion.button
                                                                    animate={{
                                                                        backgroundColor: clicked.split(":")[0] === questionAnswer ? ["yellow", "#0f0", clicked.split(":")[0] === answers[correct] ? "green" : "red"] : "white",
                                                                    }}
                                                                    transition={{
                                                                        delay: 0.5,
                                                                    }}
                                                                    onClick={() => !Boolean(clicked[1]) ? handleAnswer(questionAnswer) : null}
                                                                    className={`p-3 font-bold rounded-2xl bg-white text-black`}
                                                                >
                                                                    {questionAnswer}
                                                                </motion.button>

                                                            )
                                                        ))
                                                    }
                                                </div>
                                            </motion.div>
                                        ))
                                    )
                                }
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    <p>Loading user data...</p>
                )
            }
        </AnimatePresence>
    );
};

export default Quiz;
