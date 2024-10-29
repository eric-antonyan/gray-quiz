import React, { useEffect, useState } from 'react';
import bg from "../assets/img/background.jpg";
import defaultUser from "../assets/img/default_user.png";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

type Question = {
    task: string;
    answers: string[];
    correct: number;
    group: string;
};

const Quiz = () => {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState<string | null>(null);
    const [answered, setAnswered] = useState(false);
    const [clicked, setClicked] = useState<string>("");
    const [userData, setUserData] = useState<any>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isWin, setIsWin] = useState<boolean>(false);

    const { quizId } = useParams();

    useEffect(() => {
        const initializeData = async () => {
            if (!(window as any).Telegram) return;

            const tg = (window as any).Telegram.WebApp;
            const user = tg.initDataUnsafe?.user;

            if (!user) return;

            try {
                const [userResponse, questionsResponse] = await Promise.all([
                    axios.get(`https://gray-server.vercel.app/users/${user.id}`),
                    axios.get(`https://gray-server.vercel.app/quiz/${quizId}/find`)
                ]);

                setUserData(userResponse.data);
                setQuestions(questionsResponse.data);
            } catch (error) {
                console.error("Error initializing data:", error);
            }
        };

        initializeData();
    }, [quizId]);

    useEffect(() => {
        if (questions.length > 0 && userData) {
            setDefaultLevel(userData, questions);
        }
    }, [questions, userData]);

    const setDefaultLevel = async (user: any, questions: Question[]) => {
        console.log(questions)
        const group = questions[0];
        if (!group) return;

        try {
            const response = await axios.get(`https://gray-server.vercel.app/levels/${user.id}/${group}`);
            const level = response.data.level;
            setQuestionIndex(level <= questions.length ? level + 1 : 0);
        } catch (error) {
            console.error("Error setting default level:", error);
        }
    };

    const setLevel = async (newLevel: number) => {
        const group = questions[questionIndex]?.group;
        if (!group) return;

        try {
            const response = await axios.get(`https://gray-server.vercel.app/levels/${userData.id}/${group}/${newLevel}`);
            const updatedLevel = response.data.level;
            setQuestionIndex(updatedLevel);
        } catch (error) {
            console.error("Error setting new level:", error);
        }
    };

    const handleAnswer = (selectedAnswer: string) => {
        setClicked(`${selectedAnswer}:true`);
        setTimeout(() => {
            setAnswer(selectedAnswer);
            handleNextQuestion();
        }, 3000);
    };

    const handleNextQuestion = async () => {
        setAnswered(true);
        setTimeout(async () => {
            if (answer === questions[questionIndex]?.answers[questions[questionIndex]?.correct]) {
                await axios.get(`https://gray-server.vercel.app/users/${userData.id}/plus`);
            }
            await setLevel(questionIndex + 1);
            resetState();
        }, 3000);
    };

    const resetState = () => {
        setAnswered(false);
        setAnswer(null);
        setClicked("");
    };

    useEffect(() => {
        setIsWin(questions || questionIndex >= questions.length);
    }, [questionIndex, questions]);

    return (
        <AnimatePresence>
            {userData ? (
                !isWin ? (
                    <div style={{ background: `url(${bg})`, backdropFilter: "brightness(0.3)" }}
                         className="flex flex-col h-screen bg-cover w-full mx-auto">
                        <Header userData={userData} />
                        <QuizContent
                            questions={questions}
                            questionIndex={questionIndex}
                            clicked={clicked}
                            answered={answered}
                            handleAnswer={handleAnswer}
                        />
                    </div>
                ) : (
                    <WinningScreen userData={userData} />
                )
            ) : (
                <p>Loading user data...</p>
            )}
        </AnimatePresence>
    );
};

const Header = ({ userData }: { userData: any }) => (
    <div className="text-white p-5 bg-black flex justify-between items-center">
        <h1 className="font-bold text-2xl">Gray<span className="text-red-500">Quizz</span></h1>
        <Link to="/account">
            <div className="flex gap-2 items-center bg-white text-sm p-2 rounded-2xl">
                <p className="font-bold text-black">@{userData.username}</p>
                <img src={userData.photo_url || defaultUser} alt="User Avatar"
                     className="w-[30px] aspect-square object-cover rounded-full" />
            </div>
        </Link>
    </div>
);

const QuizContent = ({ questions, questionIndex, clicked, answered, handleAnswer }: any) => (
    <div style={{ backdropFilter: "brightness(0.3)" }} className="w-full overflow-hidden">
        <h1 className="text-white text-center my-5 font-bold">
            <span className="text-4xl">{questions.length} / </span><span className="text-2xl">{questionIndex}</span>
        </h1>
        <div className="flex px-5">
            <motion.div className="h-[3px] rounded-full bg-white my-5"
                        animate={{ width: `${(questionIndex * 100) / questions.length}%` }} />
        </div>
        <motion.div initial={{ x: 0 }} animate={{ x: `-${(100 / (questions.length / questionIndex)) - 10}%` }}
                    transition={{ duration: 0.25, type: 'tween' }}
                    className="flex" style={{ width: `${questions.length * 100}%` }}>
            {questions.map(({ task, answers, correct }: {
                task: string,
                answers: string[],
                correct: number
            }, i: number) => (
                <QuestionSlide key={i} task={task} answers={answers} correct={correct} questionIndex={i}
                               clicked={clicked} answered={answered} handleAnswer={handleAnswer} />
            ))}
        </motion.div>
    </div>
);

const QuestionSlide = ({ task, answers, correct, clicked, answered, handleAnswer }: any) => (
    <motion.div className="flex flex-col h-screen p-5 flex-1">
        <h1 className="text-lg font-bold text-center text-white">{task}</h1>
        <div className="flex flex-col gap-3 mt-11 w-full">
            {answers.map((answer: string, index: number) => (
                <motion.button
                    key={index}
                    onClick={() => !answered ? handleAnswer(answer) : null}
                    className={`p-3 font-bold rounded-2xl ${answered ? (index === correct ? "bg-green-500" : "bg-red-500") : "bg-white"} text-black`}
                    animate={{ backgroundColor: clicked.includes(answer) ? ["yellow", "#0f0", clicked.includes(answer) && index === correct ? "green" : "red"] : "white" }}
                    transition={{ delay: 0.5 }}
                >
                    {answer}
                </motion.button>
            ))}
        </div>
    </motion.div>
);

const WinningScreen = ({ userData }: { userData: any }) => (
    <div style={{ background: `url(${bg})`, backdropFilter: "brightness(0.3)" }}
         className="flex flex-col h-screen bg-cover w-full mx-auto">
        <Header userData={userData} />
        <div className="flex-1 p-5" style={{ backdropFilter: "brightness(0.3)" }}>
            <h1 className="text-white font-bold text-lg text-center">Հարցերը վերջացան :)</h1>
            <p className="bg-danger p-4 rounded-3xl px-5 font-bold text-white mt-5">
                Հարգելի {userData.first_name}, բալանսը տեսնելու համար սեղմեք <Link className="underline"
                                                                                   to="/account">այստեղ</Link>
            </p>
        </div>
    </div>
);

export default Quiz;
