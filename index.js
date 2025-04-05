const { Client, GatewayIntentBits } = require("discord.js");
const path = require("path");

// Importujemy funkcję z folderu funkcje/respawn.js
const { calculateRespawn } = require("./funkcje/respawn");

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.once("ready", () => {
	console.log(`Zalogowano jako ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
	// Ignoruj wiadomości od bota
	if (message.author.bot) return;

	// Sprawdź, czy wiadomość zaczyna się od "!respawn"
	if (message.content.startsWith("!respawn")) {
		// Rozbij wiadomość na argumenty
		const args = message.content.slice("!respawn".length).trim().split(/ +/);
		const championName = args[0].toLowerCase();
		const deathTime = args[1];

		// Wywołaj funkcję obliczającą czas respawnu
		const respawnTimes = calculateRespawn(championName, deathTime);
		if (respawnTimes) {
			// Wyślij odpowiedź do kanału
			message.channel.send(
				`**${championName}** ożywi się od ${respawnTimes.respawnStart} do ${respawnTimes.respawnEnd}.`
			);
		} else {
			message.channel.send(`Nie rozpoznałem czempiona: ${championName}`);
		}
	}
});
// Token bota
const TOKEN = ""; // Zamień na rzeczywisty token bota
client.login(TOKEN);
