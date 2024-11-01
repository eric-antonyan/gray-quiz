import { Header } from "./Quiz";
import { useEffect, useState } from "react";
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
                const { data: userResponse } = await axios.get(`https://gray-server.vercel.app/users/${user.id}`);
                setUserData(userResponse);
            } catch (error) {
                console.error("Error initializing data:", error);
            }
        };

        const fetchData = async () => {
            try {
                const { data: usersData } = await axios.get("https://gray-server.vercel.app/users");
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        // Initial data fetch
        fetchData();
        initializeData();

        // Set interval to refresh data every 5 seconds
        const intervalId = setInterval(fetchData, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    // Sort users by balance in descending order
    const sortedAscending = [...users].sort((a: any, b: any) => b.balance - a.balance);

    const userIndex = sortedAscending.findIndex((user) => user.id === userData?.id);

    return (
        userData && (
            <div className="bg-black h-screen overflow-y-auto">
                <Header userData={userData} />
                <div>
                    <div className="text-white sticky top-[86px] bg-black p-5 flex justify-between gap-4 font-bold border-b-1 border-slate-700">
                        <div className="flex gap-5 z-50">
                            <p>👑</p>
                            <p>User name</p>
                        </div>
                        <p>FMM</p>
                    </div>
                    {sortedAscending.slice(0, 10).map((user: any, i: number) => (
                        <div
                            key={user.id}
                            className={`text-white border-slate-600 p-5 flex justify-between gap-4 bg-gradient-to-r font-bold ${
                                i === 0
                                    ? "from-yellow-400 to-amber-500"
                                    : i === 1
                                        ? "from-zinc-300 to-zinc-500"
                                        : i === 2
                                            ? "from-yellow-500 to-amber-700"
                                            : "border-b-1 border-slate-700 bg-black"
                            }`}
                        >
                            <div className="flex gap-5">
                                <p>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</p>
                                <p>{user.username || user.first_name || user.last_name}</p>
                            </div>
                            <p>{user.balance}</p>
                        </div>
                    ))}
                    {userIndex > 10 ? (
                        <div
                            key={userData.id}
                            className="text-white border-slate-600 bg-gradient-to-r from-red-500 to-red-700 p-5 flex justify-between gap-4 bg-gradient-to-r font-bold"
                        >
                            <div className="flex gap-5">
                                <p>{sortedAscending.findIndex((user) => user.id === userData.id)}</p>
                                <p>{userData.username || userData.first_name || userData.last_name}</p>
                            </div>
                            <p>{userData.balance}</p>
                        </div>
                    ) : null}
                </div>
            </div>
        )
    );
};

export default Raiting;
