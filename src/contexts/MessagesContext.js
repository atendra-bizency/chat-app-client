import React, { createContext, useContext, useReducer } from 'react';

// Create contexts
const MessageContext = createContext(null);
const MessageDispatchContext = createContext(null);

// MessagesProvider component
export function MessagesProvider({ children }) {
  const [messages, dispatch] = useReducer(messagesReducer, initialMessages);

  return (
    <MessageContext.Provider value={messages}>
      <MessageDispatchContext.Provider value={dispatch}>
        {children}
      </MessageDispatchContext.Provider>
    </MessageContext.Provider>
  );
}

// Custom hook to access messages
export function useMessages() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
}

// Custom hook to access dispatch function
export function useMessagesDispatch() {
  const context = useContext(MessageDispatchContext);
  if (!context) {
    throw new Error('useMessagesDispatch must be used within a MessagesProvider');
  }
  return context;
}

// Reducer function
function messagesReducer(messages, action) {
  console.log(action, 'from messagesReducer');
  
  switch (action.type) {
    case 'newmessage': {
      const hours = String(new Date().getHours()).padStart(2, '0'); // Pad hours
      const minutes = String(new Date().getMinutes()).padStart(2, '0'); // Pad minutes
      return [
        ...messages,
        {
          ...action.message,
          time: `${hours}:${minutes}`, // Format time as HH:mm
        },
      ];
    }
    default:
      throw new Error('Unknown action: ' + action.type);
  }
}

// Initial state
const initialMessages = [];

// Default export
export default MessagesProvider;