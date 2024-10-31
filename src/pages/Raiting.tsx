import {Header} from "./Quiz";
import {useEffect, useState} from "react";
import axios from "axios";

const Raiting = () => {
    const [userData, setUserData] = useState<any>(null);
    const [users, setUsers] = useState<any>([]);

    useEffect(() => {
        const initializeData = async () => {
            if (!(window as any).Telegram) return;
            const tg = (window as any).Telegram.WebApp;
            const user = tg.initDataUnsafe?.user;
            if (!user) return;

            try {
                const [userResponse] = await Promise.all([
                    axios.get(`https://gray-server.vercel.app/users/${user.id}`),
                ]);

                setUserData(userResponse.data);
            } catch (error) {
                console.error("Error initializing data:", error);
            }
        };

        const fetchData = async () => {
            const response = await axios.get("https://gray-server.vercel.app/users");
            setUsers(response.data)
        }

        fetchData()

        initializeData();
    }, []);

    const sortedAscending = users.sort((a: any, b: any) =>  b.balance - a.balance);

    return (
        userData && (
            <div className={"bg-slate-900"}>
                <Header userData={userData} />
                <div className={""}>
                    <div className={"text-white sticky top-[86px] bg-slate-900 p-5 flex justify-between gap-4 font-bold border-b-1 border-slate-600"}>
                        <div className={"flex gap-5 z-50"}>
                            <p>#</p>
                            <p>User name</p>
                        </div>
                        <p>FMM</p>
                    </div>
                    {
                        users && (
                            sortedAscending.map((user: any, i: number) => (
                                <div
                                    className={`text-white border-slate-600 p-5 flex justify-between gap-4 font-bold ${i === 0 ? "bg-yellow-400" : i === 1 ? "bg-gray-300" : i === 2 ? "bg-orange-700" : "border-b-1"}`}>
                                    <div className={"flex gap-5"}>
                                        <p>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</p>
                                        <p>{user.username ? user.username : user.first_name ? user.first_name : user.last_name}</p>
                                    </div>
                                    <p>{user.balance}</p>
                                </div>
                            ))
                        )
                    }
                </div>
            </div>
        )
    )
}

export default Raiting;