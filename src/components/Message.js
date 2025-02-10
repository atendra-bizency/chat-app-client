import React, { memo } from 'react';

function Primary({ data: { user, chat, time } }) {
  return (
    <div className="column is-12 is-paddingless primary">
      <strong className="is-block">{user}</strong>
      <div className="text">
        {chat}
        <time className="is-block has-text-right">{time}</time>
      </div>
    </div>
  );
}



function Secondary({ data: { user, chat, time } }) {
  return (
    <div className="column is-12 has-text-right is-paddingless is-clearfix secondary">
      <strong className="is-block">{user}</strong>
      <div className="text is-pulled-right">
        {chat}
        <time className="is-block has-text-right">{time}</time>
      </div>
    </div>
  );
}

function Message({ data }) {
  //console.log(data);
  
  //console.log('refresh:' + Math.random());
  switch (data.type) {
    case 'primary':
      return <Primary data={data} />;

    case 'secondary':
      return <Secondary data={data} />;
    default:
      return <>Grrr</>;
  }
}

export default memo(Message);
