import React from 'react';
import { useEffect, useState } from 'react';
import socket from '../Socket';

function UserList({ onUserClick }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    function onGetOnlineUser(onlineUsers) {
      setUsers(onlineUsers);
    }

    function onNewUser(newUser) {
      setUsers([...users, newUser]);
    }

    // Get online user
    socket.on('get online user', onGetOnlineUser);

    // New user
    socket.on('new user', onNewUser);

    return () => {
      socket.off('get online user', onGetOnlineUser);
      socket.off('new user', onNewUser);
    }
  }, [users]);
  
  const handleUserClick=(user)=>{
    if (onUserClick){
      //debugger
      onUserClick(user)
    }
  }

  return (
    <div id="activeUsersList">
      <h2 className="has-text-centered is-size-6 is-marginless is-paddingless">
         Online <span>({users.length})</span>
      </h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            <div className="user-card cursor-pointer"
            onClick={()=>handleUserClick(user)}>
              <i className="fa fa-user" aria-hidden="true"></i>&nbsp;
              <p className="user-name">  {user}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
