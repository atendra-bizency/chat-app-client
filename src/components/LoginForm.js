import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LoginForm({ setLogin, setUserName }) {
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is already logged in on page load
  useEffect(() => {
    const storedUser = localStorage.getItem('chatUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setLogin(true);
      setUserName(user.fullName);
    }
  }, [setLogin, setUserName]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:1234/api/login', {
        fullname: fullName,
        password,
      });

      if (response.data.success) {
        localStorage.setItem('chatUser', JSON.stringify(response.data.user));
        setIsLoggedIn(true);
        setLogin(true);
        setUserName(response.data.user.fullName);
      } else {
        setLoginMessage(response.data.message);
      }
    } catch (error) {
      setLoginMessage('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('chatUser');
    setIsLoggedIn(false);
    setLogin(false);
    setUserName('');
  };

  return (
    <div className="column">
      {isLoggedIn ? (
        // Show Logout Button when logged in
        <div className="has-text-centered">
          <p className="is-size-5">Welcome, {fullName}!</p>
          <button className="button is-danger mt-3" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        // Show Login Form when logged out
        <form onSubmit={handleLogin}>
          <div className="field is-grouped is-grouped-centered">
            <div className="control">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
                type="text"
                placeholder="Full name"
                required
                autoFocus
              />
            </div>

            <div className="control">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                type="password"
                placeholder="Password"
                required
              />
            </div>

            <div className="control">
              <input className="button is-primary" type="submit" value="Login" />
            </div>
          </div>

          {loginMessage && <p className="help is-danger">{loginMessage}</p>}
        </form>
      )}
    </div>
  );
}

export default LoginForm;
