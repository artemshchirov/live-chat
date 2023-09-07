const app = () => {
  const SERVER_URL = 'https://chat-0dso.onrender.com';

  const socket = io(SERVER_URL);

  const messageInput = document.querySelector('.message-input');
  const messagesList = document.querySelector('.messages-list');
  const sendButton = document.querySelector('.send-btn');
  const usernameInput = document.querySelector('.username-input');

  const messages = [];

  const getMessages = async () => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/chat`);

      renderMessages(data);

      data.forEach((item) => messages.push(item));
    } catch (error) {
      console.log(error.message);
    }
  };

  getMessages();

  const handleSendMessage = (text) => {
    if (!text.trim()) {
      return;
    }

    sendMessage({
      username: usernameInput.value || 'Anonymous',
      text,
      createdAt: new Date(),
    });

    messageInput.value = '';
  };

  messageInput.addEventListener(
    'keydown',
    (evt) => evt.keyCode === 13 && handleSendMessage(evt.target.value),
  );

  sendButton.addEventListener('click', () =>
    handleSendMessage(messageInput.value),
  );

  const renderMessages = (messages) => {
    let messagesHtml = '';

    messages.forEach(
      (message) =>
        (messagesHtml += `
				<li class="bg-dark p-2 rounded mb-2 d-flex justify-content-between message">
				<div class="mr-2">
						<span class="text-info">${message.username}</span>
						<p class="text-light mt-2">${message.text}</p>
				</div>
				<span class="text-muted text-right date">
						${new Date(message.createdAt).toLocaleString('en', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
				</span>
		</li>`),
    );

    messagesList.innerHTML = messagesHtml;
  };

  const sendMessage = (message) => socket.emit('sendMessage', message);

  socket.on('recMessage', (message) => {
    messages.push(message);
    renderMessages(messages);
  });
};

app();
