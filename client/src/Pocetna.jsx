import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Pocetna.css';

const Pocetna = () => {
  const [email, setEmail] = useState('');
  const [anketas, setAnketas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionResponse = await axios.get('http://localhost:5000/check_session', { withCredentials: true });
        setEmail(sessionResponse.data.email || "No email provided");

        const anketaResponse = await axios.get('http://localhost:5000/anketas', { withCredentials: true });
        setAnketas(anketaResponse.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setEmail("Error fetching email");
        setError("Failed to fetch session data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEmailClick = (anketa) => {
    navigate('/Email', { state: { anketa } }); // Pass anketa data to Email page
  };

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
          <h3 className="section-title">Tvoje ankete</h3>
          {anketas.length === 0 ? (
            <div className="no-anketas">Nijedna anketa nije pronadjena.</div>
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
                  <button
                    className="email-button"
                    onClick={() => handleEmailClick(anketa)}
                  >
                    Pošalji email
                  </button>
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
