import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './Overview.css'; // Import the new CSS file

const Overview = () => {
    const { id } = useParams();
    const [anketa, setAnketa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Track the index of the element being edited and the temporary text value
    const [editIndex, setEditIndex] = useState(null);
    const [editText, setEditText] = useState("");

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
        return <div className="loading-message">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!anketa) {
        return <div className="no-anketa">No Anketa found.</div>;
    }

    // Start editing a specific element
    const handleEdit = (index) => {
        setEditIndex(index);
        setEditText(anketa.elementi[index].text);
    };

    // Cancel editing
    const handleCancel = () => {
        setEditIndex(null);
        setEditText("");
    };

    // Save the edited text
    const handleSave = async (index) => {
        // Create a new copy of elementi
        const updatedElementi = [...anketa.elementi];
        updatedElementi[index].text = editText;

        const updatedAnketa = { ...anketa, elementi: updatedElementi };

        try {
            // Send the updated Anketa to the backend
            await axios.put(`http://localhost:5000/anketas/${id}`, updatedAnketa, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // Update local state
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
                                <span className="element-text">{element.text} - Votes: {element.broj}</span>
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
