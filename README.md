# Simple Master Server for ElDewrito

A simple [Node.js](https://nodejs.org/) implementation of a master server for [ElDewrito](https://www.eldewrito.org/).

## Installation

**TL;DR**:

```shell
git clone https://github.com/Pauwlo/Simple-Master-Server.git
cd Simple-Master-Server
cp .env.example .env
npm i && npm run production
```

1. Clone this repository: `git clone https://github.com/Pauwlo/Simple-Master-Server.git`

2. Enter the new directory: `cd Simple-Master-Server`

3. Create a config file based on the example one: `cp .env.example .env`

4. Install dependencies: `npm i`

5. Serve the application: `npm run production` (requires [PM2](https://pm2.keymetrics.io/))

If you don't want to use PM2, you can run the app with the following command: `node index.js`

## Specifications

GET `/list`

Return the list of currently announced servers.

Example response:

```json
{
  "result": {
    "code": 0,
    "msg": "OK",
    "servers": [
      "1.2.3.4:11775",
    ]
  }
}
```

GET `/announce`

Announce an ElDewrito server or remove it from the master server.

Parameters:

- *[int]* `port` The Server.Port the ElDewrito server is listening on
- *[bool|int]* `shutdown` (optional) Whether the ElDewrito server is shutting down (and should be removed)

### Examples

Announcing an ElDewrito server to the master server:

`GET /announce?port=11775`

Remove a previously announced ElDewrito server from the master server:

`GET /announce?port=11775?shutdown=true`
