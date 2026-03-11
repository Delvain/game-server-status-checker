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

async function getCurrentChannelName() {
	const res = await fetch(`${DISCORD_API}/channels/${CHANNEL_ID}`, {
		headers: {
			Authorization: `Bot ${TOKEN}`,
		},
	})

	const data = await res.json()
	return data.name
}

async function updateChannelName(newName) {
	const currentName = await getCurrentChannelName()

	if (currentName === newName) {
		console.log('No change needed:', newName)
		return
	}

	console.log(`Renaming channel: ${currentName} → ${newName}`)

	await fetch(`${DISCORD_API}/channels/${CHANNEL_ID}`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bot ${TOKEN}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name: newName }),
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
