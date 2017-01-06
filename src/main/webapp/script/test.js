navigator.tcpPermission.requestPermission({remoteAddress:"10.1.2.168", remotePort:50001}).then(
  function() {
    // Permission was granted
    // Create a new TCP client socket and connect to remote host
    var mySocket = new TCPSocket("10.1.2.168", 50001);

    // Send data to server
    mySocket.writeable.write("Hello World").then(
        function() {

            // Data sent sucessfully, wait for response
            console.log("Data has been sent to server");
            mySocket.readable.getReader().read().then(
                ({ value, done }) => {
                    if (!done) {
                        // Response received, log it:
                        console.log("Data received from server:" + value);
                    }

                    // Close the TCP connection
                    mySocket.close();
                }
            );
        },
       function(){ console.error("Sending error: ", e);}
    );

    // Signal that we won't be writing any more and can close the write half of the connection.
    mySocket.halfClose();

    // Log result of TCP connection attempt.
    mySocket.opened.then(
      function() {
        console.log("TCP connection established sucessfully");
      },
     function(){console.error("TCP connection setup failed due to error: ", e);}
    );

    // Handle TCP connection closed, either as a result of the webapp
    // calling mySocket.close() or the other side closed the TCP
    // connection or an error causing the TCP connection to be closed.
    mySocket.closed.then(
      function() {
         console.log("TCP socket has been cleanly closed");
      },
     function(){ console.error("TCP socket closed due to error: ", e);}
    );
  },
 function(){ console.error("Connection to 10.1.2.168 on port 6789 was denied due to error: ", e);}
);