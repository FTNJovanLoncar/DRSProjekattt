import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './Survey.css';

const Survey = () => {
    const { surveyId } = useParams(); // Uzima ID iz URL-a
    const [survey, setSurvey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Proveravamo da li imamo surveyId
        if (!surveyId) {
            setError("Survey ID is missing");
            return;
        }

        // Funkcija za dohvat ankete
        const fetchSurvey = async () => {
            try {
                // Pravimo zahtev prema backend-u
                const response = await axios.get(`http://localhost:5000/anketas/${surveyId}`);
                setSurvey(response.data);  // Postavljamo podatke ankete
            } catch (err) {
                console.error("Error fetching survey:", err);
                setError("Failed to load survey.");  // Ako je došlo do greške
            } finally {
                setLoading(false);  // Kada se zahtev završi
            }
        };

        fetchSurvey();
    }, [surveyId]);  // Reagira na promenu surveyId

    const handleVote = async (questionIdx, rating) => {
        try {
            const response = await axios.get(`http://localhost:5000/respond?anketa_id=${surveyId}&question=${questionIdx}&rating=${rating}`);
            const updatedSurvey = { ...survey };
            updatedSurvey.elementi[questionIdx] = response.data.updated_question;
            setSurvey(updatedSurvey);  // Ažuriraj stanje ankete sa novim podacima
        } catch (err) {
            console.error("Error submitting vote:", err);
            setError("Failed to submit vote.");
        }
    };

    if (loading) {
        return <div className="loading-message">Loading...</div>;  // Prikazujemo loading dok se podaci učitavaju
    }

    if (error) {
        return <div className="error-message">{error}</div>;  // Ako dođe do greške
    }

    if (!survey) {
        return <div className="no-survey">No survey found.</div>;  // Ako anketu nije moguće pronaći
    }

    return (
        <div className="survey-container">
            <h1 className="survey-title">{survey.naziv}</h1>
            <ul className="survey-list">
                {survey.elementi.map((question, idx) => {
                    // Koristimo logiku da izbegnemo NaN
                    const average = question.prosek && question.prosek !== 0 ? question.prosek.toFixed(2) : "N/A";
                    const votes = question.broj_ocena || 0;  // Broj glasova
                    return (
                        <li key={idx} className="survey-item">
                            <div className="question-text">
                                <strong>{idx + 1}. {question.text}</strong>
                            </div>
                            <div className="votes-info">
                                Votes: {votes} | Average: {average}  {/* Prikazujemo broj glasova i prosečan broj glasova */}
                            </div>
                            <div className="rating-buttons">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        className="rating-button"
                                        onClick={() => handleVote(idx, rating)}  // Pozivamo handleVote kada se klikne dugme
                                    >
                                        {rating}
                                    </button>
                                ))}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Survey;
