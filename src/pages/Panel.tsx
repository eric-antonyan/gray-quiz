import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";

type Question = {
    uuid: string;
    title: string;
};

const Panel = () => {
    const [locations, setLocations] = useState<Question[] | null>(null);
    const [formData, setFormData] = useState({
        task: '',
        answer_1: '',
        answer_2: '',
        answer_3: '',
        correct: '',
        group: '',
        image: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://gray-server.vercel.app/quiz");
                setLocations(response.data);
            } catch (error) {
                console.error("Error fetching locations", error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            const response = await axios.post("https://gray-server.vercel.app/question", formData, {
                headers: {
                    'Content-Type': 'application/json', // Ensure the form is treated as JSON data
                },
            });
            console.log("Form submitted successfully", response.data);
            // Optionally reset the form here if needed
            setFormData({
                task: '',
                answer_1: '',
                answer_2: '',
                answer_3: '',
                correct: '',
                group: '',
                image: ''
            });
        } catch (error) {
            console.error("Error submitting form", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p>Harcy</p>
                <input
                    className="border-1"
                    placeholder="greq harcy"
                    name="task"
                    value={formData.task}
                    onChange={handleChange}
                />

                <p>Patasxanner</p>
                <div className="flex flex-col gap-3">
                    <input
                        name="answer_1"
                        className="border-1"
                        value={formData.answer_1}
                        onChange={handleChange}
                    />
                    <input
                        name="answer_2"
                        className="border-1"
                        value={formData.answer_2}
                        onChange={handleChange}
                    />
                    <input
                        name="answer_3"
                        className="border-1"
                        value={formData.answer_3}
                        onChange={handleChange}
                    />
                </div>
                <p>Image</p>
                <input name={"image"} value={formData.image} onChange={handleChange} className={"border-1"} />

                <p>chisht e</p>
                <input
                    name="correct"
                    className="border-1"
                    type="number"
                    value={formData.correct}
                    onChange={handleChange}
                />

                <p>vayry</p>
                {locations ? (
                    <select name="group" value={formData.group} onChange={handleChange}>
                        <option>

                        </option>
                        {locations.map((location) => (
                            <option key={location.uuid} value={location.uuid}>
                                {location.title}
                            </option>
                        ))}
                    </select>
                ) : (
                    ""
                )}

                <br/>
                <button type="submit">avelacnel</button>
            </form>
        </div>
    );
};

export default Panel;
