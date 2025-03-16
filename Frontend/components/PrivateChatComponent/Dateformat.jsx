const formatTimestamp = isoString => {
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  } else {
    return date
      .toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      .toUpperCase();
  }
};

const formatDateSeparator = isoString => {
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return 'TODAY';
  } else {
    return date
      .toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
      })
      .toUpperCase();
  }
};

const isImageMessage = message => {
  if (message.type === 'image' || message.type === 'file') {
    return true;
  }

  if (typeof message.message === 'string') {
    return (
      message.message.match(/\.(jpeg|jpg|gif|png)$/) !== null ||
      message.message.includes('/fileShare/')
    );
  }

  return false;
};

export {formatTimestamp, formatDateSeparator, isImageMessage};
