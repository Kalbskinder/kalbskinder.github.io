async function loadHeroes() {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("user");
    if (!uuid) {
        document.getElementById("heroes-container").innerHTML = "<p>Keine UUID gefunden.</p>";
        return;
    }

    try {
        const res = await fetch(`https://api.hglabor.de/stats/ffa/${uuid}`);
        const data = await res.json();

        const heroes = data.heroes;
        const container = document.getElementById("heroes-container");

        if (!heroes || Object.keys(heroes).length === 0) {
            document.getElementById("no-heroes").style.display = "block";
            return;
        }

        Object.entries(heroes).forEach(([hero, abilities]) => {
            const heroDiv = document.createElement("div");
            heroDiv.classList.add("hero");

            // Button mit Icon
            const heroButton = document.createElement("button");
            heroButton.classList.add("hero-button");
            heroButton.innerHTML = `${hero.charAt(0).toUpperCase() + hero.slice(1)} <span class="dropdown-icon">&#9656;</span>`;

            const heroContent = document.createElement("div");
            heroContent.classList.add("hero-content", "hidden");

            heroButton.addEventListener("click", () => {
                heroContent.classList.toggle("hidden");
                const icon = heroButton.querySelector(".dropdown-icon");
                icon.innerHTML = heroContent.classList.contains("hidden") ? "&#9656;" : "&#9662;";
            });

            Object.entries(abilities).forEach(([ability, details]) => {
                const abilityDiv = document.createElement("div");
                abilityDiv.classList.add("ability");
            
                // Verwende die formatierte Fähigkeit, um den Namen zu ändern
                const abilityTitle = document.createElement("strong");
                abilityTitle.textContent = formatAbilityName(ability); // Name wird formatiert
                abilityDiv.appendChild(abilityTitle);
            
                Object.entries(details).forEach(([key, value]) => {
                    const row = document.createElement("div");
                    row.classList.add("ability-row");
            
                    const nameSpan = document.createElement("span");
                    nameSpan.textContent = formatAbilityName(key); // Formatierte Namen der Details
                    nameSpan.classList.add("ability-name");
            
                    const valueDiv = document.createElement("div");
                    const valueSpan = document.createElement("span");
                    const expImage = document.createElement("img");
                    expImage.src = "./images/items/384-0.png";
                    valueSpan.textContent = `${value.experiencePoints} points`;
                    valueSpan.classList.add("ability-value");
                    valueDiv.appendChild(expImage)
                    valueDiv.appendChild(valueSpan)

                    row.appendChild(nameSpan);
                    row.appendChild(valueDiv);
                    abilityDiv.appendChild(row);
                });

                heroContent.appendChild(abilityDiv);
            });

            heroDiv.appendChild(heroButton);
            heroDiv.appendChild(heroContent);
            container.appendChild(heroDiv);
        });
    } catch (error) {
        document.getElementById("heroes-container").innerHTML = "<p>Fehler beim Laden der Helden.</p>";
        console.error(error);
    }
}

function formatAbilityName(name) {
    return name
        .replace(/_/g, " ") // Ersetze Unterstriche mit Leerzeichen
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Mach den ersten Buchstaben jedes Wortes groß
}

document.addEventListener("DOMContentLoaded", loadHeroes);
