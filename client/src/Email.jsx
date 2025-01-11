import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Email = () => {
  const location = useLocation();
  const anketa = location.state?.anketa;

  const [emailInput, setEmailInput] = useState('');
  const [emailList, setEmailList] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddEmail = () => {
    if (!emailInput.includes('@') || !emailInput.includes('.')) {
      setError('Invalid email address');
      return;
    }
    if (emailList.includes(emailInput)) {
      setError('Email already added');
      return;
    }
    setEmailList([...emailList, emailInput]);
    setEmailInput('');
    setError('');
  };

  const handleRemoveEmail = (email) => {
    setEmailList(emailList.filter((e) => e !== email));
  };

  const handleSendSurveys = async () => {
    if (emailList.length === 0) {
      setError('Please add at least one email address');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/send_survey', {
        emails: emailList,
        survey: anketa,
      });

      if (response.status === 200) {
        setSuccessMessage('Survey sent successfully!');
        setEmailList([]);
      }
    } catch (err) {
      console.error('Error sending survey:', err);
      setError('Failed to send surveys. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Send Survey Email</h1>
      {anketa ? (
        <div>
          <p><strong>Anketa Name:</strong> {anketa.name}</p>
          <p><strong>Anketa Questions:</strong></p>
          <ul>
            {anketa.elementi.map((question, index) => (
              <li key={index}>{question.text}</li>
            ))}
          </ul>
          <div style={{ marginTop: '20px' }}>
            <h3>Add Email Addresses</h3>
            <input
              type="email"
              placeholder="Enter email address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              style={{ padding: '5px', width: '300px', marginRight: '10px' }}
            />
            <button onClick={handleAddEmail} style={{ padding: '5px 10px' }}>
              Add Email
            </button>
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
          </div>
          <div style={{ marginTop: '20px' }}>
            <h4>Email List</h4>
            <ul>
              {emailList.map((email, index) => (
                <li key={index}>
                  {email}{' '}
                  <button
                    onClick={() => handleRemoveEmail(email)}
                    style={{
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      padding: '2px 5px',
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleSendSurveys}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Send Survey
          </button>
          {successMessage && (
            <div style={{ color: 'green', marginTop: '20px' }}>{successMessage}</div>
          )}
        </div>
      ) : (
        <p>No Anketa data available.</p>
      )}
    </div>
  );
};

export default Email;
