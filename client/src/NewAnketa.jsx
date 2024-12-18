import { useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function NewAnketa({ userId }) {
    const [imeAnkete, setImeAnkete] = useState("");
    const [pitanja, setPitanja] = useState([""]); // One empty question initially
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleImeChange = (e) => {
      setImeAnkete(e.target.value);
    };
  
    const handlePitanjeChange = (index, value) => {
      const novaPitanja = [...pitanja];
      novaPitanja[index] = value;
      setPitanja(novaPitanja);
    };
  
    const dodajPitanje = () => {
      setPitanja([...pitanja, ""]);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Submit button clicked");

      // Include userId in the request body
      fetch("http://localhost:5000/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imeAnkete: imeAnkete,
          listaPitanja: pitanja,
          user_id: userId
        }),
        credentials: 'include',
      })
      .then((response) => {
            console.log(response);
            if (response.ok) {
                navigate("/");
            } else {
                response.json().then((error) => {
                    setError("Creating a new Survey failed: " + (error.message || "Unknown error"));
                });
            }
      })
      .catch((err) => {
        setError(`An error occurred: ${err.message}`);
        console.error("NewAnketa error details:", err);
      });
    };
  
    return (
      <div className="anketa-form">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Ime Ankete</label>
            <input
              type="text"
              value={imeAnkete}
              onChange={handleImeChange}
            />
          </div>
  
          {pitanja.map((pitanje, index) => (
            <div key={index}>
              <label>Pitanje {index + 1}</label>
              <input
                type="text"
                value={pitanje}
                onChange={(e) => handlePitanjeChange(index, e.target.value)}
              />
            </div>
          ))}
  
          <button type="button" onClick={dodajPitanje}>
            +
          </button>
          
          <button type="submit">
            Spremi Anketu
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    );
}

NewAnketa.propTypes = {
  userId: PropTypes.number // userId should be a number
};

export default NewAnketa;
