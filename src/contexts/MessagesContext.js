import React, { useReducer, createContext, useContext } from 'react';

// Initial state
const initialState = {
  messages: [],
};

// Reducer function
const messagesReducer = (state, action) => {
  console.log('Reducer Action:', action); // Debugging
  switch (action.type) {
    case 'receive message':
    case 'newmessage':
      const newMessage = {
        ...action.message,
        messageId: Date.now(), // Add a unique ID
      };
      return {
        ...state,
        messages: [...state.messages, newMessage],
      };
      case 'clearMessages':  // Add this case
            return { ...state, messages: [] }; // ✅ Reset only the messages array

    default:
      return state;
  }
};
// Create context
const MessagesContext = createContext();
const MessageDispatchContext = createContext(null);

// Provider component
const MessagesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messagesReducer, initialState);

  return (
    <MessagesContext.Provider value={state}>
     <MessageDispatchContext.Provider value={{ messages: state.messages, dispatch }}>
        {children}
      </MessageDispatchContext.Provider>
    </MessagesContext.Provider>
  );
};

// Custom hook to use the MessagesContext
const useMessagesState = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessagesState must be used within a MessagesProvider');
  }
  return context.messages;
};

// Custom hook to use the dispatch function
const useMessagesDispatch = () => {
  const context = useContext(MessageDispatchContext);
  if (!context) {
    throw new Error('useMessagesDispatch must be used within a MessagesProvider');
  }
  return context.dispatch;
};

export { MessagesProvider, useMessagesState, useMessagesDispatch };