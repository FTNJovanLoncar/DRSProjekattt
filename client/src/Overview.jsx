import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './Overview.css';

const Overview = () => {
    const { id } = useParams();
    const [anketa, setAnketa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editIndex, setEditIndex] = useState(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        const fetchAnketa = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/anketas/${id}`, { withCredentials: true });
                setAnketa(response.data);
            } catch (err) {
                console.error("Error fetching Anketa:", err);
                setError("Failed to fetch Anketa data.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAnketa();
        }
    }, [id]);

    if (loading) {
        return <div className="loading-message">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!anketa) {
        return <div className="no-anketa">No Anketa found.</div>;
    }

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditText(anketa.elementi[index].text);
    };

    const handleCancel = () => {
        setEditIndex(null);
        setEditText("");
    };

    const handleSave = async (index) => {
        const updatedElementi = [...anketa.elementi];
        updatedElementi[index].text = editText;

        const updatedAnketa = { ...anketa, elementi: updatedElementi };

        try {
            await axios.put(`http://localhost:5000/anketas/${id}`, updatedAnketa, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            setAnketa(updatedAnketa);
            setEditIndex(null);
            setEditText("");
        } catch (err) {
            console.error("Error updating Anketa:", err);
            alert("Failed to save changes.");
        }
    };

    return (
        <div className="overview-container">
            <h1 className="overview-title">{anketa.naziv}</h1>
            <ul className="overview-list">
                {anketa.elementi.map((element, index) => (
                    <li key={index} className="overview-list-item">
                        {editIndex === index ? (
                            <div className="edit-container">
                                <input
                                    type="text"
                                    className="edit-input"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                                <div className="button-group">
                                    <button className="save-button" onClick={() => handleSave(index)}>Save</button>
                                    <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="element-container">
                                <span className="element-text">
                                    {element.text} - Votes: {element.broj_ocena || 0} - 
                                    Average: {element.prosek?.toFixed(2) || "N/A"}
                                </span>
                                <button className="edit-button" onClick={() => handleEdit(index)}>Edit</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Overview;
