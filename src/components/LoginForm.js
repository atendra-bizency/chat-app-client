import React, { useEffect, useState } from 'react';
import socket from '../Socket';
import axios from 'axios';

function LoginForm({ setLogin, setUserName , fetchAllConversationOfUser, getLoginUserData}) {
  const [fullName, setFullName] = useState('');
  const [userPassword, setUserPassword] = useState(''); // Add password state
  const [loginMessage, setLoginMessage] = useState(null);
  const [loginUserData, setLoginUserData] = useState([]);
  //console.log(fetchConversationDetails);

  const [mainUrl, setMainUrl] = useState(null);

  useEffect(() => {
      // Get the query parameters from the URL
      const queryParams = new URLSearchParams(window.location.search);

      // Get the 'mainUrl' parameter
      const url = queryParams.get('mainUrl');

      if (url) {
          //console.log('Main Project URL:', url);
          setMainUrl(url); // Store in state
      }
  }, []);
  

  const handleLogin = async (e) => {
    e.preventDefault();

    // Determine role based on URL
    const currentPath = window.location.pathname;
    const role = mainUrl?.includes('/mis') ? 'agent' : 'customer';
    //const role = currentPath?.includes('/') ? 'agent' : 'customer';

    //console.log('Role:', role);
    

    // Emit login event to Socket.io

    function onCheckUser(isUsing) {
      if (isUsing) {
        setLoginMessage('This username is already in use.');
      } else {
        setLogin(true);
        setUserName(fullName);
      }
    }

    // Create login data
    const loginData = { username: fullName, role };
    if (role === 'agent') {
      loginData.password = userPassword; // Only include password for agents
    }

    try {
      const response = await axios.post('https://localhost:1234/api/login', loginData);
      console.log(response.data);
      

      if (response.data.success) {
        localStorage.setItem('chatUser', JSON.stringify(response.data));
        setLogin(true);
        setUserName(fullName);
        setLoginUserData(response.data)
        getLoginUserData(response.data)
        socket.emit('login', fullName, role, response.data.user.userId, response.data.user._id);
        fetchAllConversationOfUser(response.data.user._id)
      } else {
        setLoginMessage(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginMessage('Failed to login. Please try again.');
    }

    socket.on('check user', onCheckUser);
  };

  //console.log(window.location.pathname);
  



  return (
    <div className="column">
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

          {/* Show password field only if role is "agent" */}
          {/* {window.location.pathname.includes('/') && ( */}
          {mainUrl && mainUrl.includes('/mis') && (
            <div className="control">
              <input
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                className="input"
                type="password"
                placeholder="Password"
                required
              />
            </div>
          )}

          <p className={"help is-danger" + (loginMessage == null ? " is-hidden" : "")}>
            {loginMessage}
          </p>

          <div className="control">
            <input className="button" type="submit" value="Login" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
