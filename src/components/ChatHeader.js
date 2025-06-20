import React from 'react';
import Status from './Status';
function ChatHeader({ title }) {
  return (
    <header className="columns is-mobile">
      <div className="ml-4 mt-4 has-text-left-tablet has-text-centered" style={{position: 'absolute'}}>
        <Status />
      </div>
      <div className="column">
        <h1 className="is-size-5-tablet has-text-centered">{title}</h1>
      </div>
      <div className="column is-2-mobile is-hidden-tablet has-text-right">
        <i className="fas fa-bars"></i>
      </div>
    </header>
  );
}

export default ChatHeader;
