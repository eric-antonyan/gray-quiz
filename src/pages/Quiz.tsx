import React, {useEffect, useState} from 'react';
import { questions } from '../mock-data';
import bg from "../assets/img/background.jpg";
import { AnimatePresence, motion } from "framer-motion";

const Quiz = () => {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState<string | null>("");
    const [answered, setAnswered] = useState(false);
    const [clicked, setClicked] = useState("");
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        // Check if Telegram Web Apps API is available
        if ((window as any).Telegram) {
            const tg = (window as any).Telegram.WebApp;

            // Retrieve user data
            const user = tg.initDataUnsafe.user;

            // Set user data to state
            if (user) {
                setUserData(user);
            } else {
                console.error("User data not available");
            }

            // Optionally, you can handle any other configurations or event listeners here
        } else {
            console.error("Telegram Web Apps API not available");
        }
    }, []);

    const handleAnswer = (checkedAnswer: string) => {
        setClicked(`${checkedAnswer}:true`)
        setTimeout(() => {
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
    };

    const handleContinue = () => {
        setAnswered(true);
        setTimeout(() => {
            setQuestionIndex((prevIndex) => prevIndex + 1);
            handleReset();
        }, 3000)
    };

    return (
        <AnimatePresence>
            {
                userData && (
                    <div style={{
                        background: `url(${bg})`,
                        backdropFilter: "brightness(0.3)"
                    }} className='flex flex-col h-screen bg-cover w-full mx-auto'>
                        <div className='text-white p-5 bg-black flex justify-between items-center'>
                            <h1 className='font-bold text-2xl'>Gray<span className='text-red-500'>Quizz</span></h1>
                            <div className='flex gap-2 items-center bg-white text-sm p-2 rounded-2xl'>
                                <p className='font-bold text-black'>@{userData.username}</p>
                                <img src="https://thecyberexpress.com/wp-content/uploads/What-is-a-Hacker.png"
                                     className='w-[30px] aspect-square object-cover rounded-full' alt=""/>
                            </div>
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
                            <motion.div initial={{x: 0}} animate={{x: -(100 / (questions.length / questionIndex)) + "%"}}
                                        transition={{
                                            duration: 0.25,
                                            type: 'tween'
                                        }} className='flex' style={{width: questions.length * 100 + "%"}}>
                                {
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
                                                                className={`font-bold ${index !== correct ? "bg-red-500 text-white active:bg-red-200/40" : "bg-green-500 text-white active:bg-green-200/40"} p-3 rounded-2xl`}
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
                                                                onClick={() => handleAnswer(questionAnswer)}
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
                                }
                            </motion.div>
                        </div>
                    </div>
                )
            }
        </AnimatePresence>
    );
};

export default Quiz;
