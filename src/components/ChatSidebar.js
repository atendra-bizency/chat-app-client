import React from 'react';
import UserList from './UserList';

function ChatSidebar({sendAgentDetails, onAgentSelect, sendUserConversation, callFromUserListConversation, userStatuses }) {
  return (
    <aside className=" is-hidden-mobile has-background-light has-text-black" style={{ paddingLeft: '1rem', overflow: 'auto' }}>
      <UserList sendAgentDetails={sendAgentDetails}  userStatuses={userStatuses} onAgentSelect={onAgentSelect} callFromUserListConversation={callFromUserListConversation}  sendUserConversation={sendUserConversation}/>
    </aside>
  );
}

export default ChatSidebar;
