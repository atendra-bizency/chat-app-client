import React from 'react';
import { useState } from 'react';
import socket from '../Socket';

function LoginForm({ setLogin, setUserName }) {
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');
  const [loginMessage, setLogingMessage] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();

    // Login
    socket.emit('login', fullName, '65c31043e5b40e589fc97e0b');

    function onCheckUser(isUsing) {
      if (isUsing) {
        setLogingMessage('This username is already in use.');
      } else {
        setLogin(true);
        setUserName(fullName);
        setUserId('65c31043e5b40e589fc97e0b');
      }
    }

    socket.on('check user', onCheckUser);
  }

  function setLoginUseData(user) {
    if (user) {
      localStorage.setItem('chatUser', JSON.stringify(user));
  }
  }

  socket.on('store user', setLoginUseData)

  
  return (
    <div className="column">
      <form onSubmit={handleLogin}>
        <div className="field is-grouped is-grouped-centered bg-red">
          <div className="control">
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" type="text" placeholder="Full name" required="required" pattern="([\w]+[ ]+[\w])\w+" autoFocus={true} />
            <p className={"help is-danger" + (loginMessage == null ? " is-hidden" : "")}>{loginMessage}</p>
          </div>

          <div className="control">
            <input className="button" type="submit" value="Login" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
