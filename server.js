import express from 'express'
import fetch from 'node-fetch'

const app = express()
app.use(express.json())

const TOKEN = process.env.DISCORD_TOKEN
const CHANNEL_ID = process.env.CHANNEL_ID

function getChannelName(data) {
	if (data.status === 'UP') {
		const players = data.players ?? '?'
		const max = data.maxplayers ?? '?'
		return 'enshrouded-🟢'
	}
	return 'enshrouded-🔴'
}

app.post('/kuma', async (req, res) => {
	const name = getChannelName(req.body)

	await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bot ${TOKEN}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name }),
	})

	res.sendStatus(200)
})

app.listen(3000, () => console.log('Webhook running'))
