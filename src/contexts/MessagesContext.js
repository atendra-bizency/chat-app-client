import React, { useReducer, createContext, useContext } from 'react';

// Initial state
const initialState = {
  messages: [],
};

// Reducer function
const messagesReducer = (state, action) => {
  switch (action.type) {
    case 'newmessage':
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    default:
      return state;
  }
};

// Create context
const MessagesContext = createContext();

// Provider component
const MessagesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messagesReducer, initialState);

  return (
    <MessagesContext.Provider value={{ messages: state.messages, dispatch }}>
      {children}
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
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessagesDispatch must be used within a MessagesProvider');
  }
  return context.dispatch;
};

export { MessagesProvider, useMessagesState, useMessagesDispatch };