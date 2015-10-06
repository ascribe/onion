'use strict';

let client = new WebSocket('ws://localhost.com:8000/ws/foobar?subscribe-broadcast&publish-broadcast&echo');

client.onerror = function() {
    console.log('Connection Error');
};

client.onopen = function() {
    console.log('WebSocket Client Connected');
    function sendNumber() {
        if (client.readyState === client.OPEN) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            client.send(number.toString());
            setTimeout(sendNumber, 5000);
        }
    }
    //sendNumber();
};

client.onclose = function() {
    console.log('echo-protocol Client Closed');
};

client.onmessage = function(e) {
    if (typeof e.data === 'string' && e.data !== "--heartbeat--") {
        console.log("Received: '" + e.data + "'");
    }
};

export default client;