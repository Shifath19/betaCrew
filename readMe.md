

# BetaCrew Exchange Server Client

This project consists of a Node.js client for connecting to a stock exchange server. It communicates over TCP to request and receive packet data, which is then saved to a JSON file.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Node.js](https://nodejs.org/) (version 14 or later)
- npm (comes with Node.js)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/betacrew_exchange_server.git
   cd betacrew_exchange_server

    Navigate to the project directory:

    bash

cd betacrew_exchange_server

Install dependencies (if applicable):

If you have any dependencies listed in a package.json file, run:

bash

    npm install

Usage

    Start the server:

    In one terminal window, navigate to the server directory and start the server:

    bash

node main.js

You should see a message indicating that the TCP server has started.

Run the client:

Open another terminal window, navigate to the client directory, and execute the client script:

bash

    node client.js

    You should see a message indicating that the client has connected to the server and that packets are being received. The packets will be stored in output.json.

Output

The client will create an output.json file in the project directory containing the received packets. If no packets are received, the file will be empty.
