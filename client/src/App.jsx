import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Pocetna from './Pocetna';
import Login from './Login';
import { useState, useEffect } from "react";
import Registration from './Register';
import NewAnketa from './NewAnketa';
import Overview from './Overview';
import Email from './Email'; // Import the new Email component

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:5000/check_session", {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Pocetna />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/Registracija" element={<Registration onRegister={setUser} />} />
          <Route path="/Create" element={<NewAnketa userId={user?.id} />} />
          <Route path="/Overview/:id" element={<Overview />} />
          <Route path="/Email" element={<Email />} /> {/* Add this route */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
