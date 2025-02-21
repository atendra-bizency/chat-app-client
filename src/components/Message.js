import React, { memo } from 'react';

function Primary({ data: { chat, timestamp, receiver , type} }) {

  if (type === "information") {
    return (
      <div className="column is-12 has-text-centered is-paddingless">
        <strong>{chat}</strong> 
      </div>
    );
  }
  return (
    <div className="column is-12 is-paddingless primary">
      {/* <strong className="is-block">{receiver}</strong> */}
      <div className="text">
        {chat}
        <time className="is-block has-text-right">{timestamp}</time>
      </div>
    </div>
  );
}

function Information({ data: { user, chat } }) {
  return (
    <div className="column is-12 has-text-centered is-paddingless">
      <strong>{user}</strong> {chat}
    </div>
  );
}

function Secondary({ data: { chat, timestamp, sender, type } }) {

  if (type === "information") {
    return (
      <div className="column is-12 has-text-centered is-paddingless">
        <strong>{chat}</strong> 
      </div>
    );
  }
  return (
    <div className="column is-12 has-text-right is-paddingless is-clearfix secondary">
      <strong className="is-block">{sender}</strong>
      <div className="text is-pulled-right">
        {chat}
        <time className="is-block has-text-right">{timestamp}</time>
      </div>
    </div>
  );
}



function Message({ data }) {
  const loggedInUser = localStorage.getItem('chatUser');
  //console.log('refresh:' + Math.random());
  //console.log(data, 'from message');
  const { user } = JSON.parse(loggedInUser);

  //console.log(user._id, 'from message');


  // Determine message type
  const messageType = data.senderId === user._id ? 'secondary' : 'primary';

  //console.log(messageType, 'from message');

  switch (messageType) {
    case 'primary':
      return <Primary data={data} />;
    case 'information':
      return <Information data={data} />;
    case 'secondary':
      return <Secondary data={data} />;
    default:
      return <>Grrr</>;
  }
}

export default memo(Message);
