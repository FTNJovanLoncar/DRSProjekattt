import { useState, useEffect } from 'react';
import axios from 'axios';
import "./Pocetna.css";
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <div className="stranica">
            <ul className="nav nav-pills nav-fill">
                <li className="nav-item">
                    <Link to="/" className="nav-link active" style={{ color: 'black', fontWeight: "bold" }}>Početna</Link>
                </li>
                <li className="nav-item">
                    <Link to="/Login" className="nav-link" style={{ color: 'black', fontWeight: "bold" }}>Prijava</Link>
                </li>
                <li className="nav-item">
                    <Link to="/Registracija" className="nav-link" style={{ color: 'black', fontWeight: "bold" }}>Registracija</Link>
                </li>
            </ul>

            {loading ? (
                <div>Loading...</div> // Show loading indicator
            ) : error ? (
                <div className="error-message">{error}</div> // Show error message
            ) : (
                <>
                    <div>Email: {email}</div>
                    <h3>Your Anketas</h3>
                    <ul>
                        {anketas.map((anketa) => (
                            <li key={anketa.id}>
                                <Link
                                    to={`/Overview/${anketa.id}`} // Ensure anketa.id is passed correctly
                                    style={{ color: 'black', textDecoration: 'underline' }}
                                >
                                    {anketa.name}
                                </Link>

                            </li>
                        ))}
                    </ul>
                </>
            )}
            <Link to="/Create" className="nav-link" style={{ color: 'black', fontWeight: "bold" }}>Napravi novu anketu</Link>
        </div>
    );
};

export default Pocetna;
