import React from 'react';
import { useEffect, useRef } from 'react';
import { useMessagesDispatch } from '../contexts/MessagesContext';
import socket from '../Socket';

function MessageForm({ fullName ,messages, userId}) {
  const textareaRef = useRef(null);
  const emojiRef = useRef(null);
  const dispatch = useMessagesDispatch();

  //console.log(messages.userId);
  

  const checkSubmit = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.keyCode === 13 || e.keyCode === 10)) {
      handleSubmit();
    }
  }

  let user
    const storedUser = localStorage.getItem('chatUser');
    
  if (storedUser) {
       user = JSON.parse(storedUser);
  }
  

  

  const handleSubmit = async() => {
    let textarea = textareaRef.current;
    const messageText = textarea.value.trim();

    if (!messageText) return; // Don't send empty messages

    socket.emit('send message', {
      user: fullName,
      senderId: user._id,
      receiverId: userId,
      text: textarea.value
    });



    dispatch({
      type: 'newmessage',
      message: {
        type: 'primary',
        user: fullName,
        senderId: user._id,
        receiverId: userId,
        text: textarea.value
      }
    });
    
    const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const currentTime = new Date().toLocaleTimeString(); // Format as HH:MM:SS AM/PM  


    try {
      
      const res= await fetch(`https://localhost:1234/api/sendMessage/`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          sender:user._id,
          receiver:userId,
          chat:textarea.value,
          date:currentDate,
          time:currentTime

        })
      })

      if (!res.ok) {
        throw new Error('Failed to fetch messages'); // Handle HTTP errors
      }   
      const resData= await res.json();
      console.log(resData);
    } catch (error) {
      console.error('Error fetching messages:', error); 
    }


    textarea.value = '';
  }

  const appendEmoji = (e) => {
    let emoji = e.target.textContent;
    const textarea = textareaRef.current;
    textarea.value += emoji;
  }

  useEffect(() => {
    let fragment = document.createDocumentFragment();
    let emojRange = [[128513, 128591], [128640, 128704]];

    for (let i = 0, length = emojRange.length; i < length; i++) {
      let range = emojRange[i];
      for (let x = range[0]; x < range[1]; x++) {
        let newEmoji = document.createElement('button');
        newEmoji.className = 'button is-white is-paddingless is-medium'
        newEmoji.innerHTML = '&#' + x + ';';
        newEmoji.addEventListener('click', appendEmoji);
        fragment.appendChild(newEmoji);
      }
    }

    emojiRef.current.appendChild(fragment);
  }, []);

  return (
    <>
      <div className="column is-paddingless">
        <textarea ref={textareaRef} autoFocus={true} className="textarea is-shadowless" rows="2" placeholder="Type a message" onKeyDown={checkSubmit}></textarea>
      </div>

      <div className="column is-2-mobile is-1-tablet is-paddingless">

        <div className="emoji-wrapper">
          <button className="button is-medium is-paddingless is-white" id="Emoji">
            <i className="far fa-smile"></i>
          </button>
          <div ref={emojiRef} id="EmojiList" className="popover has-background-white"></div>
        </div>

        <button className="button is-medium is-paddingless is-white" onClick={handleSubmit}><i className="far fa-paper-plane"></i></button>
      </div>
    </>
  );
}

export default MessageForm;
