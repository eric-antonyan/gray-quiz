import {FC, useEffect, useState} from "react";
import axios from "axios";
import {FaArrowRight, FaChevronLeft, FaGear, FaGears, FaLeftRight, FaXmark} from "react-icons/fa6";
import {Link} from "react-router-dom";
import defaultUser from "../assets/img/default_user.png"
import {FaCheckCircle} from "react-icons/fa";

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

            console.log(user)


            if (user) {
                const fetchData = async () => {
                    const response = await axios.get(`https://gray-server.vercel.app/users/${user.id}`)
                    console.log(response.data)
                    if ((response as any).data.id) {
                        setUserData(response.data)
                    }
                }

                const fetchQuizzes = async () => {
                    const response = await axios.get(`https://gray-server.vercel.app/quiz/${user.id}`);
                    setQuizzes(response.data)
                }
                fetchQuizzes()
                fetchData()
            }
        }
    }, []);

    const format = (number: number) => {
        return Intl.NumberFormat('ru-RU', {
            currency: 'AMD',
            style: 'currency'
        }).format(number);
    };

    return (
        userData && (
            <div className="mx-auto">
                <header
                    className={`flex items-center sticky top-0 bg-white justify-between p-4 border-b text-darker border-gray-300 `}>
                    <Link to={"/quiz"}>
                        <FaChevronLeft className=""/>
                    </Link>
                    <span
                        className="font-bold text-lg">{userData.username ? userData.username : `${userData.first_name} ${userData.last_name}`}</span>
                    <FaGear/>
                </header>
                <div className="flex flex-col items-center mt-6">
                    <img
                        src={userData.photo_url ? userData.photo_url : defaultUser}
                        alt={`${userData.first_name} ${userData.last_name}`}
                        className={`w-[150px] aspect-square rounded-full border-2 border-primary`}
                    />
                    <h2 className={`mt-4 text-xl font-semibold text-black`}>{userData.first_name} {userData.last_name ? userData.last_name : null}</h2>
                    <p className="text-gray-600">{userData.username ? `@${userData.username}` : null}</p>
                    <button className={`bg-primary px-3 py-2 text-sm text-white rounded-2xl font-bold mt-4`}>
                        {format(userData.balance).replace("AMD", "FMM")}
                    </button>
                </div>
                <div className={"mt-5"}>
                    <h2 className={"font-bold text-2xl text-center"}>Քուիզներ</h2>
                </div>
                <div className={"grid grid-cols- p-5 mt-5 gap-5"}>
                    {
                        quizzes.map((quiz, i) => (
                            <div key={i} className={"bg-gray-200 rounded-3xl cursor-pointer h-[200px] overflow-hidden"}
                                 style={{background: `url(${quiz.quiz.background})`, backgroundSize: "cover"}}>
                                <div className={"w-full h-full p-5 flex flex-col"}
                                     style={{backdropFilter: `brightness(40%)`}}>
                                    <div className={"flex justify-between items-center"}>
                                        <h1 className={"text-white text-2xl font-bold flex-1"}>{quiz.quiz.title}</h1>
                                        {
                                            quiz.quiz.inDevelopment ? (
                                                <div className={"flex items-center my-5"}>
                                                    <p className={"font-bold bg-gray-400 p-2 rounded-full text-white text-[10px] inline-block"}>Մշակվում
                                                        է</p>
                                                </div>
                                            ) : null
                                        }
                                    </div>

                                    {
                                        !quiz.quiz.inDevelopment && (
                                            <div
                                                className={"text-white font-bold text-lg flex-[4] flex items-center justify-between"}>
                                                <p className={"text-2xl"}>{quiz.level + 1}/<span
                                                    className={"text-sm"}>{quiz.size}</span></p>
                                            </div>
                                        )
                                    }
                                    <div className="flex justify-end gap-5 mt-auto">
                                        <Link
                                            to={!quiz.quiz.inDevelopment && quiz.size >= quiz.level + 1 ? `/quiz/${quiz.quiz.uuid}` : ""}>
                                            <button
                                                disabled={quiz.quiz.inDevelopment || quiz.size <= quiz.level + 1} // Disable if in development or not the last level
                                                className="text-sm bg-white text-black p-3 px-6 disabled:bg-gray-300 rounded-full flex gap-3 items-center"
                                            >
                                                Անցնել {quiz.size >= quiz.level ? <FaArrowRight/> : <FaCheckCircle/>}
                                            </button>
                                        </Link>
                                        <Link
                                            to={!quiz.quiz.inDevelopment && quiz.size === quiz.level + 1 ? `/test/${quiz.quiz.uuid}` : ""}>
                                            <button
                                                disabled={quiz.quiz.inDevelopment || quiz.size > quiz.level + 1} // Disable if not in development or the size is not equal to level + 1
                                                className="text-sm bg-white text-black p-3 px-6 disabled:bg-gray-300 rounded-full flex gap-3 items-center"
                                            >
                                                Կրկնել {quiz.size !== quiz.level ? <FaArrowRight/> : <FaXmark/>}
                                            </button>
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    );
};

export default Account;