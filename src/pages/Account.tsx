import { FC, useEffect, useState } from "react";
import axios from "axios";
import {FaChevronLeft, FaGear, FaGears, FaLeftRight} from "react-icons/fa6";
import { Link } from "react-router-dom";
import defaultUser from "../assets/img/default_user.png"

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
}

const Account = () => {
    const [userData, setUserData] = useState<any>();

    useEffect(() => {
        if ((window as any).Telegram) {
            const tg = (window as any).Telegram.WebApp;
            const user = tg.initDataUnsafe.user;

            console.log(user)


            if (user) {
                const fetchData = async () => {
                    const response = await axios.get(`https://gray-serv.onrender.com/users/5351850870`)
                    console.log(response.data)
                    if ((response as any).data.id) {
                        setUserData(response.data)
                    }
                }
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
                <header className={`flex items-center justify-between p-4 border-b text-darker border-gray-300 `}>
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
                    <h2 className={`mt-4 text-xl font-semibold text-white`}>{userData.first_name} {userData.last_name}</h2>
                    <p className="text-gray-600">{userData.username ? `@${userData.username}` : null}</p>
                    <button className={`bg-primary px-3 py-2 text-sm text-white rounded-2xl font-bold mt-4`}>
                        {format(userData.balance).replace("AMD", "FMM")}
                    </button>
                </div>
            </div>
        )
    );
};

export default Account;