import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Overview = () => {
    const { id } = useParams();
    const [anketa, setAnketa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnketa = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/anketas/${id}`, { withCredentials: true });
                setAnketa(response.data); // Set the fetched anketa
            } catch (err) {
                console.error("Error fetching Anketa:", err);
                setError("Failed to fetch Anketa data.");
            } finally {
                setLoading(false); // Stop loading spinner
            }
        };

        if (id) {
            fetchAnketa();
        }
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!anketa) {
        return <div>No Anketa found.</div>;
    }

    return (
        <div>
            <h1>{anketa.naziv}</h1>
            <ul>
                {anketa.elementi.map((element, index) => (
                    <li key={index}>
                        {element.text} - Votes: {element.broj}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Overview;
