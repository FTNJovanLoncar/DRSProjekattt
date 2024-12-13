import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import './Register.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Registration({ onRegister }) {
  const location = useLocation(); // Call useLocation before useEffect
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (location.pathname === '/Registracija') {
      document.body.classList.add('custom-page-background');
    } 

    // Cleanup function to remove the class when the component unmounts or the location changes
    return () => {
      document.body.classList.remove('custom-page-background');
    };

   
  }, [location.pathname]);
  const handleBack=(event)=>{
    navigate("/")
  }
  const handleSubmit = (event) => {
    event.preventDefault();
   
    if (!name || !surname || !email || !password) {
      setError('Please fill out all the fields.');
      return;
    }
    if(password.length<5){
    setError('Password too weak!')
    return
    }

    setError('');
    setLoading(true);

    fetch('http://localhost:5000/signup', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        ime: name, 
        prezime: surname, 
        email: email, 
        lozinka: password 
      }),
    })
    .then((response) => {
        setLoading(false);
        console.log(response);
        if (response.ok) {
            response.json().then((user) => {
                onRegister(user); // Set the logged-in user
                alert('Registration successful!');
                navigate("/"); // Redirect to the home page
            });
        } else {
            response.json().then((error) => {
                setError("Registration failed: " + (error.error || "Unknown error"));
            });
        }
    })
    .catch((err) => {
        setLoading(false);
        setError(`An error occurred: ${err.message}`); // More descriptive error
        console.error("Registration error details:", err);
    });
};



  return (
 <div>
 <div className='container'>     
      <h3 style={{fontWeight:'bold',padding:'50px'}}>Create account</h3>
   
      {loading && <div>Loading...</div>}
      
      <form onSubmit={handleSubmit}>
        
        <div className="mb-3">
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            id="name" 
            className="form-control" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter your name" 
          />
        </div>

        <div className="mb-3">
          <label htmlFor="surname">Surname</label>
          <input 
            type="text" 
            id="surname" 
            className="form-control" 
            value={surname} 
            onChange={(e) => setSurname(e.target.value)} 
            placeholder="Enter your surname" 
          />
        </div>
        <div className="mb-3">
  <label htmlFor="email">Email</label>
  <input 
    type="email" 
    id="email" 
    className="form-control" 
    value={email} 
    onChange={(e) => setEmail(e.target.value)} 
    placeholder="Enter your email" 
    autoComplete="new-email"  // More specific autocomplete setting
  />
</div>

<div className="mb-3">
  <label htmlFor="password">Password</label>
  <input 
    type="password" 
    id="password" 
    className="form-control" 
    value={password} 
    onChange={(e) => setPassword(e.target.value)} 
    placeholder="Enter your password" 
    autoComplete="new-password"  // More specific autocomplete setting
  />
</div>

     

        {error && <div className="alert alert-danger">{error}</div>}
      
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Loading...' : 'Register'}
        </button>
      </form>
    </div>
    <button className='form-button2' type="button" onClick={handleBack}>back</button>
    </div>
  );
}

Registration.propTypes = {
  onRegister: PropTypes.func.isRequired,
};

export default Registration;
