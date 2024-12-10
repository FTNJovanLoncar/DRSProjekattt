import { NavLink } from "react-router-dom";
import PropTypes from 'prop-types'; // Import PropTypes

function Nav({ user, logout }) {
  return (
    <section>
      {user ? (
        <>
          <NavLink to={"/"}>Home</NavLink>
          <button onClick={() => logout()}>Logout</button>
        </>
      ) : (
        <>
          <NavLink to={"/Login"}>Login</NavLink>
        </>
      )}
    </section>
  );
}

// Add PropTypes validation for user and logout props
Nav.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.null]),  // user can be null or an object
  logout: PropTypes.func.isRequired,  // logout should be a function
};

export default Nav;
