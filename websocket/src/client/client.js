let userId = Math.ceil(Math.random() * 10000, 2);

function Message(userId, message, time) {
  this.userId = userId;
  this.message = message;
  this.time = time;

  Object.defineProperty(this, 'formatMessage', {
    value() {
      return `${this.userId}: ${this.message}`
    },
    configurable: true,
    enumerable: false,
    writable: false
  });
  
}

var ws = new WebSocket('ws://localhost:8080/socket');

ws.onopen =  function () {
  sendMessage(`User ${userId} joined the chat`);
};

ws.onmessage = function (evt) {
  console.log(evt);
  displayMessage(JSON.parse(evt.data));
};

function displayMessage(messageObject) {
  let message = new Message(messageObject.userId, messageObject.message, messageObject.time);
  let messageRow = document.createElement('p')
  messageRow.innerHTML = message.formatMessage();
  document.getElementById('messageContainer').appendChild(messageRow);
}

function sendMessage(message) {
  let clonedMessage = new Message(userId, message, new Date());
  console.log(clonedMessage.formatMessage());
  ws.send(JSON.stringify(clonedMessage));
}

function sendUserMessage() {
  let message = document.getElementById('inputMessage').value;
  if (message) {
    sendMessage(message);
    document.getElementById('inputMessage').value = '';  
  }
}

window.sendUserMessage = sendUserMessage;
