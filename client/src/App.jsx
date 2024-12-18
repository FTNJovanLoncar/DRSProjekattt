import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Pocetna from './Pocetna';
import Login from './Login';
import { useState, useEffect } from "react";
import Registration from './Register';
import NewAnketa from './NewAnketa';
import Overview from './Overview';

function App() {
  const [user, setUser] = useState(null); // State to hold logged-in user

  // Check session on initial load
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:5000/check_session", {
          credentials: 'include', // Ensure cookies are sent
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data); // Set logged-in user data
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    }
    fetchData();
  }, []); // Run only once on component mount

  return (
    <div>
      <BrowserRouter> {/* Ensure BrowserRouter wraps the entire app */}
        <Routes>
          <Route path="/" element={<Pocetna />} /> {/* Default route */}
          <Route path="/login" element={<Login onLogin={setUser} />} /> {/* Pass setUser to Login */}
          <Route path="/Registracija" element={<Registration onRegister={setUser} />} /> {/* Pass setUser to Login */}
          <Route path="/Create" element={<NewAnketa userId={user?.id} />} />
          <Route path="/Overview/:id" element={<Overview />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
