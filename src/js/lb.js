async function getAllPlayers(page) {
    try {
        const players = await getPage(page)
        const playerList = document.querySelector("#leaderboard tbody");

        playerList.innerHTML = "";

        let counter = 1;

        for (const player of players) {
            const username = await getPlayer(player.playerId);
            const kills = player.kills;
            const deaths = player.deaths;
            const bounty = player.bounty
            const kdr = (deaths === 0) ? kills : (kills / deaths).toFixed(2);
            const avatarSrc = `https://crafatar.com/avatars/${player.playerId}`;

            const playerRow = document.createElement("tr");
            playerRow.classList.add("player-card")
            playerRow.setAttribute('onclick', `info('${player.playerId}')`);


            playerRow.innerHTML = `
                <td class="position">${counter}</td> <!-- Zähler hier -->
                <td class="avatar"><img src="${avatarSrc}" alt="Avatar"></td>
                <td>${username}</td>
                <td>${kills}</td>
                <td>${deaths}</td>
                <td>${kdr}</td>
                <td>${bounty}</td>
            `;

            playerList.appendChild(playerRow);
            counter++;
        }
    } catch (error) {
        console.error('Fehler beim Laden der Spieler:', error);
    }
}

function info(uuid) {
    window.location.href = 'stats.html?user=' + uuid;
}

async function getPage(page) {
    const response = await fetch(`https://api.hglabor.de/stats/ffa/top?sort=kills&page=${page}`);
    if (!response.ok) {
        throw new Error(`Fehler: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

async function getPlayer(uuid) {
    const response = await fetch(`https://playerdb.co/api/player/minecraft/${uuid}`);
    if (response.ok) {
        let player = await response.json();
        return player.data.player.username;
    } else {
        throw new Error(`Fehler: ${response.status} ${response.statusText}`);
    }
}

document.addEventListener('DOMContentLoaded', getAllPlayers(1));
