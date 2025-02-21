import React from 'react';
import UserList from './UserList';

function ChatSidebar({sendAgentDetails, onAgentSelect, sendUserConversation, callFromUserListConversation }) {
  return (
    <aside className="column is-2 is-hidden-mobile has-background-light has-text-black">
      <UserList sendAgentDetails={sendAgentDetails} onAgentSelect={onAgentSelect} callFromUserListConversation={callFromUserListConversation}  sendUserConversation={sendUserConversation}/>
    </aside>
  );
}

export default ChatSidebar;
