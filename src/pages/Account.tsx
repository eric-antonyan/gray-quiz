import {FC, useEffect, useState} from "react";
import axios from "axios";
import {FaArrowRight, FaChevronLeft, FaGear, FaGears, FaLeftRight, FaRepeat, FaTrash, FaXmark} from "react-icons/fa6";
import {Link, useParams} from "react-router-dom";
import defaultUser from "../assets/img/default_user.png"
import {FaCheckCircle} from "react-icons/fa";
import "@radix-ui/themes/styles.css";
import {AlertDialog, Button, Flex, Theme} from "@radix-ui/themes";
import {questions} from "../mock-data";

type Quiz = {
    quiz: {
        title: string;
        uuid: string;
        background: string;
        inDevelopment: boolean;
    }

    size: number;
    level: number;
}

const Account = () => {
    const [userData, setUserData] = useState<any>();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    useEffect(() => {
        if ((window as any).Telegram) {
            const tg = (window as any).Telegram.WebApp;
            const user = tg.initDataUnsafe.user;
            tg.expand();

            if (user) {
                const fetchData = async () => {
                    const response = await axios.get(`https://gray-server.vercel.app/users/${user.id}`)
                    if (response.data.id) {
                        setUserData(response.data)
                    }
                }

                const fetchQuizzes = async () => {
                    const response = await axios.get(`https://gray-server.vercel.app/quiz/${user.id}`);
                    setQuizzes(response.data)
                }
                fetchQuizzes();
                fetchData();
            }
        }
    }, []);

    const format = (number: number) => {
        return Intl.NumberFormat('ru-RU', {
            currency: 'AMD',
            style: 'currency'
        }).format(number);
    };

    const handleClear = async () => {
        const response = await axios.get(`https://gray-server.vercel.app/quiz/${userData.id}/clear`)
        const fetchData = async () => {
            const response = await axios.get(`https://gray-server.vercel.app/users/${userData.id}`)
            if (response.data.id) {
                setUserData(response.data)
            }
        }
        fetchData();
        setQuizzes(response.data)
    }

    const levelsSum = quizzes.reduce((total, quiz) => total + quiz.level, 0);
    const levelsSizeSum = quizzes.reduce((total, quiz) => total + quiz.size, 0);
    const percent = levelsSizeSum ? ((levelsSum * 100) / levelsSizeSum).toFixed(0) : 0;

    return (
        userData && (
            <Theme appearance={"dark"}>
                <div className="mx-auto">
                    <header
                        className="flex items-center sticky top-0 z-50 bg-black justify-between p-4 border-b text-darker border-gray-300">
                        <Link to={"/quiz"} className={"cursor-pointer"}>
                            {percent + "%"}
                        </Link>
                        <span className="font-bold text-lg">
                            {userData.username ? userData.username : `${userData.first_name} ${userData?.last_name}`}
                        </span>
                        <AlertDialog.Root>
                            <AlertDialog.Trigger>
                                <FaTrash/>
                            </AlertDialog.Trigger>
                            <AlertDialog.Content>
                                <AlertDialog.Title>Սկսել նորից</AlertDialog.Title>
                                <AlertDialog.Description>Սկսե՞լ նորից, միավորները զրոյանալու են և ամեն ինչ սկսվելու է
                                    նորից</AlertDialog.Description>
                                <Flex gap="3" mt="4" justify="end">
                                    <AlertDialog.Cancel>
                                        <Button variant="soft" color="gray">Cancel</Button>
                                    </AlertDialog.Cancel>
                                    <AlertDialog.Action>
                                        <Button onClick={handleClear} variant="solid" color="red">Կատարել</Button>
                                    </AlertDialog.Action>
                                </Flex>
                            </AlertDialog.Content>
                        </AlertDialog.Root>
                    </header>
                    <div className="flex flex-col items-center mt-6">
                        <img src={userData.photo_url ? userData.photo_url : defaultUser}
                             alt={`${userData.first_name} ${userData.last_name}`}
                             className="w-[150px] aspect-square rounded-full border-2 border-primary"/>
                        <h2 className="mt-4 text-xl font-semibold">{userData.first_name} {userData.last_name}</h2>
                        <p className="text-gray-600">{userData.username ? `@${userData.username}` : null}</p>
                        <button className="bg-primary px-3 py-2 text-sm text-white rounded-2xl font-bold mt-4">
                            {format(userData.balance).replace("AMD", "FMM")}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 p-5 mt-5 gap-5">
                        <Link to={"/raiting"} className={"bg-yellow-500 p-5 font-bold text-black rounded-full flex justify-between items-center"}>
                            <p className={"flex items-center gap-3"}>Տեսնել #TOP-երը <span className={"text-sm rounded-full px-3 text-white bg-red-500 p-1"}>Նոր</span></p>
                            <FaArrowRight />
                        </Link>
                        {quizzes.map((quiz, i) => (
                            <div key={i} className="bg-gray-200 rounded-3xl cursor-pointer h-[200px] overflow-hidden"
                                 style={{background: `url(${quiz.quiz.background})`, backgroundSize: "cover"}}>
                                <div className="w-full h-full p-5 flex flex-col"
                                     style={{backdropFilter: `brightness(40%)`}}>
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-white text-2xl font-bold flex-1">{quiz.quiz.title}</h1>
                                        {quiz.quiz.inDevelopment && (
                                            <div className="flex items-center my-5">
                                                <p className="font-bold bg-red-600 p-2 rounded-full text-white text-[10px] inline-block">Մշակվում
                                                    է</p>
                                            </div>
                                        )}
                                    </div>
                                    {!quiz.quiz.inDevelopment && (
                                        <div
                                            className="text-white font-bold text-lg flex-[4] flex items-center justify-between">
                                            <p className="text-2xl">{quiz.level}/<span
                                                className="text-sm">{quiz.size}</span></p>
                                        </div>
                                    )}
                                    <div className="flex justify-end gap-5 mt-auto">
                                        <Link
                                            to={!quiz.quiz.inDevelopment && quiz.size !== quiz.level ? `/quiz/${quiz.quiz.uuid}` : ""}>
                                            <button disabled={quiz.quiz.inDevelopment || quiz.size === quiz.level}
                                                    className="text-sm bg-white text-black p-3 px-6 disabled:bg-gray-300 rounded-full flex gap-3 items-center">
                                                Անցնել {quiz.size >= quiz.level ? <FaArrowRight/> : <FaCheckCircle/>}
                                            </button>
                                        </Link>
                                        <Link
                                            to={!quiz.quiz.inDevelopment && quiz.size === quiz.level ? `/test/${quiz.quiz.uuid}` : ""}>
                                            <button disabled={quiz.quiz.inDevelopment || quiz.size > quiz.level}
                                                    className="text-sm bg-white text-black p-3 px-6 disabled:bg-gray-300 rounded-full flex gap-3 items-center">
                                                Կրկնել {quiz.size !== quiz.level + 1 ? <FaArrowRight/> : <FaRepeat/>}
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Theme>
        )
    );
};

export default Account;
