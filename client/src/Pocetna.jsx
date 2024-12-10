import { useState, useEffect } from 'react';
import axios from 'axios';
import "./Pocetna.css";
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Pocetna = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(null); // State to handle errors

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/check_session', { withCredentials: true });
                setEmail(response.data.email || "No email provided");
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
                <div>Email: {email}</div> // Show email when data is fetched successfully
            )}
        </div>
    );
};

export default Pocetna;
