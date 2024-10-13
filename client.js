const net = require('net');
const fs = require('fs');

const HOST = '127.0.0.1';
const PORT = 3000;

const client = new net.Socket();
let packets = []; // Array to store received packets
let sequenceNumbers = new Set(); // To track received sequence numbers

client.connect(PORT, HOST, () => {
    console.log('Connected to server');
    const callType = Buffer.alloc(1);
    callType.writeUInt8(1, 0); // Request "Stream All Packets"
    client.write(callType);
});

client.on('data', (data) => {
    // Parse the received data and extract packet details
    

    while (data.length > 0) {
        const packet = parsePacket(data);
        if (packet) {
            packets.push(packet);
            sequenceNumbers.add(packet.sequence);
            data = data.slice(packet.size); // Remove parsed packet from buffer
        } else {
            break; // Stop if we cannot parse any further
        }
    }
    handleMissingSequences();
});

client.on('error', (err) => {
    console.error('Connection error:', err.message);
});

client.on('close', () => {
    console.log('Connection closed');
    saveToJson(); // Save packets to JSON when the connection closes
});

function handleMissingSequences() {
  const received = Array.from(sequenceNumbers).sort((a, b) => a - b);
  const missing = [];

  for (let i = 1; i < received.length; i++) {
      for (let j = received[i - 1] + 1; j < received[i]; j++) {
          missing.push(j);
      }
  }

  if (missing.length > 0) {
      console.log('Missing packets:', missing);
      // Optionally, you can request these missing packets from the server
  }
}


// Function to request a missing packet
function requestMissingPacket(sequence) {
    const request = Buffer.alloc(5); // Assuming 4 bytes for sequence and 1 byte for call type
    request.writeUInt8(2, 0); // Call Type 2: Resend Packet
    request.writeUInt32BE(sequence, 1); // Write the sequence number
    client.write(request);
    saveToJson();
}

// Function to parse
function parsePacket(data) {
  if (data.length < 13) return null; // Ensure there is enough data to parse

  const packet = {
      symbol: data.toString('utf8', 0, 4).trim(),
      type: data.readUInt8(4), // Buy/Sell type
      quantity: data.readUInt32BE(5),
      price: data.readUInt32BE(9),
      sequence: data.readUInt32BE(13),
  };
  saveToJson();
  return packet;
}


// Save the packets to a JSON file
function saveToJson() {
    fs.writeFileSync('output.json', JSON.stringify(packets, null, 2));
}
