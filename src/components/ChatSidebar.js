import React, { useEffect, useState } from 'react';
import UserList from './UserList';

function ChatSidebar({ onFetchMessage, onFetchUserId, isLogin, setIsLogin }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (!isLogin) return; // Don't fetch users if not logged in

    // Fetch logged-in user details from localStorage
    const storedUser = localStorage.getItem('chatUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFullName(user.fullName);
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch(`https://localhost:1234/api/users`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }

        const resData = await res.json();
        setUsers(resData);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [isLogin]); // Run effect only when `isLogin` changes

  const handleLogout = () => {
    localStorage.removeItem('chatUser');
    setIsLogin(false); // Update login state
  };

  return (
    <aside className="column is-2 is-hidden-mobile has-background-light has-text-black">
      {isLogin ? (
        <>
          <div className="has-text-centered">
            <p className="is-size-5">Welcome, {fullName}!</p>
            <button className="button is-danger mt-3" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <UserList users={users} onFetchMessage={onFetchMessage} onFetchUserId={onFetchUserId} isLogin={isLogin}/>
        </>
      ) : (
        <div className="p-4 text-center font-semibold text-red-600">Login first</div>
      )}

      {error && <div className="text-center text-red-500 mt-2">{error}</div>}
    </aside>
  );
}

export default ChatSidebar;
