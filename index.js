const express = require('express')
const app = express()
const cors = require('cors')
const net = require('net')
require('dotenv').config()

const port = process.env.PORT
let servers = []

app.use(cors())
app.disable('x-powered-by')

app.get('/', (req, res) => {
  res.status(204).send()
})

app.get('/list', (req, res) => {
  res.send({
		result: {
			code: 0,
			msg: 'OK',
			servers: servers
		}
	})
})

app.get('/announce', (req, res) => {
	const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
	const ipType = net.isIP(ip)

	let isInvalid = false
	let port = parseInt(req.query.port)
	let shutdown = req.query.shutdown === 'true' || req.query.shutdown === '1'

	const server = `${ip}:${port}`
	let message = shutdown ? `Removing ${server}` : `Announcing ${server}`

	if (ipType === 6) {
		isInvalid = true
		message = 'Sorry, IPv6 is not supported yet. Please use an IPv4 address instead.'
	} else if (ipType !== 4) {
		isInvalid = true
		message = `Your IP address is invalid.`
	}

	if (port < 1 || port > 65535 || isNaN(port)) {
		isInvalid = true
		message = 'This port is invalid. Please use a number between 1024 and 65535.'
	}

	if (req.query.port === undefined) {
		isInvalid = true
		message = 'The server port is required.'
	}

	if (isInvalid) {
		return error(res, ip, message, 400)
	}

	// TODO: Validate info server JSON

	log(message, ip)

	shutdown
		? remove(server)
		: announce(server)

	res.status(204).send()
})

app.listen(port, () => {
  log(`Master server listening on port ${port}...`)
})

function log(message, ip = undefined) {
	if (ip) {
		console.log(`[INFO] [${ip}] ${message}`)
	} else {
	  console.log(`[INFO] ${message}`)
	}
}

function error(res, ip, message, code = 500) {
	console.log(`[WARN] [${ip}] Error: ${message}`)

	return res.status(code).send({ message: message })
}

function announce(server) {
	if (!servers.includes(server)) {
		servers.push(server) // TODO: Remove server after a while
	}
}

function remove(server) {
	servers = servers.filter(s => s !== server)
}
