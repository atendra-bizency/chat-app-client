import React from 'react';
import ChatFooter from './components/ChatFooter';
import ChatHeader from './components/ChatHeader';
import ChatMain from './components/ChatMain';
import { MessagesProvider } from './contexts/MessagesContext';
import './styles/App.css';

function App() {
  return (
    <MessagesProvider>
      <div className="hero is-unselectable has-text-white  is-size-6"  style={{padding:'1rem 0rem 0rem 1rem'}}>
        {/* <div className="" > */}
          {/* <div className="container"> */}

            <ChatHeader title="BizChat" />
            <ChatMain />
            {/* <ChatFooter /> */}

          {/* </div> */}
        </div>
      {/* </div> */}
    </MessagesProvider>
  );
}

export default App;
