let currentPage = 1;
let allPlayers = [];

async function getAllPlayers() {
    try {
        const players = await getPage(1); // Alle 100 Spieler holen
        allPlayers = players; // Global speichern
        showPage(currentPage); // Erste Seite anzeigen
    } catch (error) {
        console.error('Fehler beim Laden der Spieler:', error);
    }
}

function showPage(page) {
    const playerList = document.querySelector("#leaderboard tbody");
    playerList.innerHTML = ""; // Alte Inhalte löschen

    const start = (page - 1) * 10;
    const end = start + 10;
    const playersToShow = allPlayers.slice(start, end);

    let counter = start + 1;

    playersToShow.forEach(async (player, index) => {
        const username = await getPlayer(player.playerId);
        const kills = player.kills;
        const deaths = player.deaths;
        const bounty = player.bounty;
        const kdr = (deaths === 0) ? kills : (kills / deaths).toFixed(2);
        const avatarSrc = `https://crafatar.com/avatars/${player.playerId}`;

        let counterElement;

        const playerRow = document.createElement("tr");
        playerRow.classList.add("player-card");
        playerRow.setAttribute('onclick', `info('${player.playerId}')`);

        const leaderElement = document.createElement("td");
        leaderElement.innerHTML = counter;
        leaderElement.classList.add("position");
        switch (counter) {
            case 1:
                leaderElement.classList.add("first");
                break;
            case 2:
                leaderElement.classList.add("second");
                break;
            case 3:
                leaderElement.classList.add("third");
                break;
            default:
                break;
        }

        // Erstellt die einzelnen Zellen (td)
        const avatarTd = document.createElement("td");
        avatarTd.classList.add("avatar");
        avatarTd.innerHTML = `<img src="${avatarSrc}" alt="Avatar">`;

        const usernameTd = document.createElement("td");
        usernameTd.textContent = username;

        const killsTd = document.createElement("td");
        killsTd.textContent = kills;

        const deathsTd = document.createElement("td");
        deathsTd.textContent = deaths;

        const kdrTd = document.createElement("td");
        kdrTd.textContent = kdr;

        const bountyTd = document.createElement("td");
        bountyTd.textContent = bounty;

        // Füge alles in die Row ein
        playerRow.appendChild(leaderElement);
        playerRow.appendChild(avatarTd);
        playerRow.appendChild(usernameTd);
        playerRow.appendChild(killsTd);
        playerRow.appendChild(deathsTd);
        playerRow.appendChild(kdrTd);
playerRow.appendChild(bountyTd);


        playerList.appendChild(playerRow);

        setTimeout(() => {
            playerRow.querySelectorAll("td").forEach(td => td.classList.add("show"));
        }, index * 100);

        counter ++;
    });

    updatePagination();
}


function changePage(direction) {
    if ((currentPage === 1 && direction === -1) || (currentPage === 10 && direction === 1)) {
        return;
    }
    currentPage += direction;
    showPage(currentPage);
}

function updatePagination() {
    document.getElementById("currentPage").textContent = `Seite ${currentPage} von 10`;
    document.getElementById("prevPage").disabled = currentPage === 1;
    document.getElementById("nextPage").disabled = currentPage === 10;
}

async function getPage() {
    const response = await fetch(`https://api.hglabor.de/stats/ffa/top?sort=kills&page=1`);
    if (!response.ok) throw new Error(`Fehler: ${response.status} ${response.statusText}`);
    return await response.json();
}

async function getPlayer(uuid) {
    const response = await fetch(`https://playerdb.co/api/player/minecraft/${uuid}`);
    if (response.ok) {
        let player = await response.json();
        return player.data.player.username;
    } else {
        return "Unbekannt";
    }
}

function info(uuid) {
    window.location.href = 'stats.html?user=' + uuid;
}

function redirectStats() {
    window.location.href = `stats.html?user=${document.getElementById('input').value}`
}

document.addEventListener('DOMContentLoaded', getAllPlayers);
