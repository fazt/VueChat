// Socket
var socket = io()

// Vuejs Component
new Vue({
  el:'#app',
  data: {
    connectedUsers: [],
    messages: [],
    message: {
      type: '',
      action: '',
      user: '',
      text: '',
      timestamp: ''
    },
    areTyping: [],
    viewChatBox: true
  },
  created() {
    // when 'user joined', update connectedUsers arrays
    socket.on('user joined', socketId => {
        axios.get('/onlineusers')
          .then(response => {
            // get already connectedUsers first
            for(var key in response.data) {
              if (this.connectedUsers.indexOf(key) <= -1) {
                this.connectedUsers.push(key);
              }
            }
          });

        const infoMsg = {
          "type": "info",
          "msg": "User" + socketId + " has joined"
        };

        this.messages.push(infoMsg);
    });

    // chat event messages
    socket.on('chat:message', message => this.messages.push(message))

    // chat event 'user typing'
    socket.on('user typing', username => this.areTyping.push(username))

    // server emits 'stopped typing'
    socket.on('stopped typing', username => {
      var index = this.areTyping.indexOf(username);
      if (index >= 0) {
        this.areTyping.splice(index, 1);
      }
    });

    //if 'user left' remove from the connectedUsers array
    socket.on('user left', socketId => {
      var index = this.connectedUsers.indexOf(socketId);
      if (index >= 0) {
        this.connectedUsers.splice(index, 1);
      }

      var infoMsg = {
        "type": "info",
        "msg": "User" + socketId + " has joined"
      };
      this.messages.push(infoMsg);
    })
  },
  methods: {
    send() {
      this.message.type = 'chat';
      this.message.user = this.message.user || socket.id;
      this.message.timestamp = moment().calendar();
      socket.emit('chat:message', this.message);

      // cleanning data
      this.message.type = '';
      this.message.timestamp = '';
      this.message.text = '';
    },
    userIsTyping(username) {
      if(this.areTyping.indexOf(username) >= 0) {
        return true;
      }
      return false;
    },
    usersAreTyping() {
      if (this.areTyping.indexOf(socket.id) <= -1) {
        this.areTyping.push(socket.id);
        socket.emit('user typing', socket.id);
      }
    },
    stoppedTyping(keyCode) {
      if (keyCode == '13' || (keyCode == '8' && this.message.text == '')) {
        var index = this.areTyping.indexOf(socket.id);
        if (index >= 0) {
          this.areTyping.splice(index, 1);
          socket.emit('stopped typing', socket.id);
        }
      }
    }
  }
})
