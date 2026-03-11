import express from 'express'
import fetch from 'node-fetch'

const app = express()
app.use(express.urlencoded({ extended: true }))

const TOKEN = process.env.DISCORD_TOKEN
const CHANNEL_ID = process.env.CHANNEL_ID

const DISCORD_API = 'https://discord.com/api/v10'

const getChannelName = (status) => {
	const indicator = status === 'UP' ? '🟢' : status === 'DOWN' ? '🔴' : ''
	return `enshrouded${indicator}`
}

async function updateChannelName(status) {
	await fetch(`${DISCORD_API}/channels/${CHANNEL_ID}`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bot ${TOKEN}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name: getChannelName(status) }),
	})
}

app.post('/kuma', async (req, res) => {
	console.log('Kuma webhook received:', req.body)
	try {
		const status = req.body.status
		const name = getChannelName(status)
		await updateChannelName(name)
	} catch (err) {
		console.error('Error updating channel:', err)
	}

	res.sendStatus(200)
})

app.listen(3000, () => console.log('Webhook running'))
