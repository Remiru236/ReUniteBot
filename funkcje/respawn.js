const fs = require("fs");
const path = require("path");

// Wczytaj dane o czempionach z pliku JSON
const championsFilePath = path.join(__dirname, "czempy.json");
let championRespawnTimes = {};

fs.readFile(championsFilePath, (err, data) => {
	if (err) {
		console.error("Błąd wczytywania pliku czempionów:", err);
		return;
	}
	try {
		championRespawnTimes = JSON.parse(data);
	} catch (error) {
		console.error("Błąd parsowania danych JSON:", error);
	}
});



// Funkcja obliczająca czas respawnu czempiona
function calculateRespawn(championName, deathTime) {
	if (!championRespawnTimes[championName]) {
		console.log(`Czempion o nazwie ${championName} nie jest rozpoznawany.`);
		return null;
	}

	// Format daty: HH:MM (24-godzinna)
	const [hours, minutes] = deathTime.split(":").map(Number);
	const now = new Date();
	let todayDeathDateTime = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		hours,
		minutes
	);

	if (todayDeathDateTime < now) {
		todayDeathDateTime.setDate(todayDeathDateTime.getDate() + 1);
	}

	const [respawnMin, respawnMax] = championRespawnTimes[championName];
	const respawnStart = new Date(
		todayDeathDateTime.getTime() + respawnMin * 60000
	);
	const respawnEnd = new Date(
		todayDeathDateTime.getTime() + respawnMax * 60000
	);

	return {
		respawnStart: formatTime(respawnStart),
		respawnEnd: formatTime(respawnEnd),
	};
}

// Funkcja formatująca godzinę
function formatTime(date) {
	return `${String(date.getHours()).padStart(2, "0")}:${String(
		date.getMinutes()
	).padStart(2, "0")}`;
}

// Eksportujemy funkcję calculateRespawn, aby była dostępna w index.js
module.exports = {
	calculateRespawn,
};
