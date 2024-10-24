import React, { useEffect, useState } from 'react';
import bg from "../assets/img/background.jpg";
import { AnimatePresence, motion } from "framer-motion";
import defaultUser from "../assets/img/default_user.png";
import axios from "axios";
import { Link } from "react-router-dom";

type Question = {
    task: string;
    answers: string[];
    correct: number;
    group: string;
}

const Quiz = () => {
    const [questionIndex, setQuestionIndex] = useState<number>(0); // Start with -1 until data is loaded
    const [answer, setAnswer] = useState<string | null>(null); // Avoid empty string for better type safety
    const [answered, setAnswered] = useState(false);
    const [clicked, setClicked] = useState("");
    const [userData, setUserData] = useState<any>(null);
    const [questions, setQuestions] = useState<Question[]>([]);

    // Fetch level based on user progress
    const fetchLevel = async () => {
        if (questions.length > 0 && questionIndex < questions.length) {
            const group = questions[questionIndex]?.group;
            if (group) {
                try {
                    const response = await axios.get(`https://gray-server.vercel.app/levels/${userData.id}/${group}`);
                    console.log(response.data);
                    setQuestionIndex(response.data.level); // Directly set the level from the response
                } catch (error) {
                    console.error("Error fetching level:", error);
                }
            }
        }
    };

    useEffect(() => {
        if ((window as any).Telegram) {
            const tg = (window as any).Telegram.WebApp;
            const user = tg.initDataUnsafe?.user;

            // Fetch questions from the server
            const fetchQuestions = async () => {
                try {
                    const response = await axios.get("https://gray-server.vercel.app/question");
                    setQuestions(response.data);
                } catch (error) {
                    console.error("Error fetching questions:", error);
                }
            };

            fetchQuestions();

            // Fetch user data if Telegram user is available
            if (user) {
                const fetchUserData = async () => {
                    try {
                        const response = await axios.get(`https://gray-server.vercel.app/users/${user.id}`);
                        console.log(response.data);
                        if (response.data?.id) {
                            setUserData(response.data);
                        }
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                    }
                };
                fetchUserData();
            }
        }
    }, []);

    // Set level when answering correctly and moving to next question
    const setLevel = async () => {
        try {
            const response = await axios.get(`https://gray-server.vercel.app/levels/${userData.id}/${questions[questionIndex].group}/${questionIndex + 1}`);
            setQuestionIndex(parseInt(response.data.level)); // Safely update the level
        } catch (error) {
            console.error("Error setting level:", error);
        }
    };

    // Set level back if needed (for retries, etc.)
    const setLevelDefault = async () => {
        try {
            const response = await axios.get(`https://gray-server.vercel.app/levels/${userData.id}/${questions[questionIndex].group}/${questionIndex}`);
            setQuestionIndex(parseInt(response.data.level));
        } catch (error) {
            console.error("Error resetting level:", error);
        }
    };

    // Trigger fetch and level logic when questions or answer changes
    useEffect(() => {
        if (questions.length > 0 && questions[questionIndex]) {
            if (answer === questions[questionIndex].answers[questions[questionIndex].correct]) {
                handleBalance();
            }
            fetchLevel(); // Fetch user progress when questionIndex is available
            setLevelDefault(); // Optionally reset level if needed
        }
    }, [answer, questions, questionIndex]);

    const handleBalance = async () => {
        try {
            await axios.get(`https://gray-server.vercel.app/users/${userData.id}/plus`);
        } catch (error) {
            console.error("Error updating balance:", error);
        }
    }

    // Handle user answers and proceed
    const handleAnswer = (checkedAnswer: string) => {
        setClicked(`${checkedAnswer}:true`);
        setTimeout(() => {
            setAnswer(checkedAnswer);
            handleContinue();
        }, 3000); // Simulate a delay before moving to the next question
    };

    // Reset after answering
    const handleReset = () => {
        setAnswered(false);
        setAnswer(null); // Clear answer to reset state
        setClicked("");
    };

    // Continue to next question
    const handleContinue = async () => {
        setAnswered(true);
        setTimeout(async () => {
            await setLevel(); // Update the level to proceed
            handleReset(); // Reset for the next question
        }, 3000);
    };

    return (
        <AnimatePresence>
            {userData ? (
                <div style={{ background: `url(${bg})`, backdropFilter: "brightness(0.3)" }} className='flex flex-col h-screen bg-cover w-full mx-auto'>
                    {/* User info and header */}
                    <div className='text-white p-5 bg-black flex justify-between items-center'>
                        <h1 className='font-bold text-2xl'>Gray<span className='text-red-500'>Quizz</span></h1>
                        <Link to={"/account"}>
                            <div className='flex gap-2 items-center bg-white text-sm p-2 rounded-2xl'>
                                <p className='font-bold text-black'>@{userData.username}</p>
                                <img src={userData.photo_url ? userData.photo_url : defaultUser} className='w-[30px] aspect-square object-cover rounded-full' alt=""/>
                            </div>
                        </Link>
                    </div>

                    {/* Question display */}
                    <div style={{ backdropFilter: "brightness(0.3)" }} className='w-full overflow-hidden'>
                        <h1 className='text-white text-center my-5 font-bold'>
                            <span className='text-4xl'>{questions.length} / </span>
                            <span className='text-2xl'>{questionIndex + 1}</span>
                        </h1>
                        <div className='flex px-5'>
                            <motion.div className='h-[3px] rounded-full bg-white my-5' animate={{ width: 100 / (questions.length - questionIndex) + "%" }}></motion.div>
                        </div>
                        <motion.div initial={{ x: 0 }} animate={{ x: -(100 / (questions.length / questionIndex)) + "%" }} transition={{ duration: 0.25, type: 'tween' }} className='flex' style={{ width: questions.length * 100 + "%" }}>
                            {questions.map(({ correct, answers, task }, i) => (
                                <motion.div key={i} transition={{ type: "spring", stiffness: 300, damping: 30 }} className='flex flex-col h-screen p-5 flex-1'>
                                    <h1 className='text-lg font-bold text-center text-white'>{i + 1}. {task}</h1>
                                    <div className='flex flex-col gap-3 mt-11 w-full'>
                                        {answers.map((questionAnswer, index) => (
                                            answered ? (
                                                <motion.button key={index} className={`font-bold ${index !== correct ? "bg-red-500 text-white" : "bg-green-500 text-white"} p-3 rounded-2xl`}>
                                                    {questionAnswer}
                                                </motion.button>
                                            ) : (
                                                <motion.button key={index} onClick={() => handleAnswer(questionAnswer)} className={`p-3 font-bold rounded-2xl bg-white text-black`}>
                                                    {questionAnswer}
                                                </motion.button>
                                            )
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </AnimatePresence>
    );
};

export default Quiz;
