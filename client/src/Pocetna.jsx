import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Pocetna.css'; // Import the new CSS file

const Pocetna = () => {
    const [email, setEmail] = useState('');
    const [anketas, setAnketas] = useState([]); // State to store the list of Anketa
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sessionResponse = await axios.get('http://localhost:5000/check_session', { withCredentials: true });
                setEmail(sessionResponse.data.email || "No email provided");

                const anketaResponse = await axios.get('http://localhost:5000/anketas', { withCredentials: true });
                setAnketas(anketaResponse.data); // Set the fetched list of Anketa
                setError(null); // Clear error if successful
            } catch (error) {
                console.error('Error fetching data:', error);
                setEmail("Error fetching email");
                setError("Failed to fetch session data.");
            } finally {
                setLoading(false); // Set loading to false when the fetch is done
            }
        };

        fetchData();
    }, []);

    return (
        <div className="pocetna-container">
            <ul className="nav nav-pills nav-fill navigation-bar">
                <li className="nav-item">
                    <Link to="/" className="nav-link active">Početna</Link>
                </li>
                <li className="nav-item">
                    <Link to="/Login" className="nav-link">Prijava</Link>
                </li>
                <li className="nav-item">
                    <Link to="/Registracija" className="nav-link">Registracija</Link>
                </li>
            </ul>

            {loading ? (
                <div className="loading-message">Loading...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="content-container">
                    <div className="user-info">
                        <span className="user-email">Email: {email}</span>
                    </div>
                    <h3 className="section-title">Your Anketas</h3>
                    {anketas.length === 0 ? (
                        <div className="no-anketas">No Anketas found.</div>
                    ) : (
                        <ul className="anketas-list">
                            {anketas.map((anketa) => (
                                <li key={anketa.id} className="anketa-item">
                                    <Link
                                        to={`/Overview/${anketa.id}`}
                                        className="anketa-link"
                                    >
                                        {anketa.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            <Link to="/Create" className="create-link">Napravi novu anketu</Link>
        </div>
    );
};

export default Pocetna;
