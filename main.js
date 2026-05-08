const htmlElement = document.documentElement;
const themeToggleButton = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");
const timeElement = document.getElementById("time");
const ageElement = document.getElementById("age");
const cardContainer = document.getElementById("card-container");
const cardTemplate = document.getElementById("project-card-template");
const skinViewerElement = document.getElementById("skin-viewer");
const themeStorageKey = "kalbskinder-theme";

let skinViewer;

function initSkinViewer() {
    skinViewer = new skinview3d.SkinViewer({
        canvas: skinViewerElement,
        width: skinViewerElement.clientWidth - 80,
        height: skinViewerElement.clientWidth - 80,
        skin: "./images/skin.png",
        cape: "./images/cape.png"
    });

    skinViewer.fov = 60;
    skinViewer.zoom = 0.72;
    skinViewer.autoRotate = false;

    skinViewer.animation = new skinview3d.WalkingAnimation();
    skinViewer.animation.speed = 0.7;

    skinViewer.nameTag = "Kalbskinder";


    window.addEventListener("resize", () => {
        if (!skinViewer) {
            console.warn("Skin viewer not initialized. Cannot resize.");
            return;
        }

        const nextSize = Math.min(340, Math.max(220, skinViewerElement.clientWidth));
        skinViewer.width = nextSize;
        skinViewer.height = nextSize;
    });
}

function setTheme(themeName) {
    const resolvedTheme = themeName === "dark" ? "dark" : "light";
    htmlElement.setAttribute("data-theme", resolvedTheme);
    localStorage.setItem(themeStorageKey, resolvedTheme);

    const isDark = resolvedTheme === "dark";
    themeLabel.textContent = isDark ? "Light" : "Dark";

    const existingIcon = themeToggleButton.querySelector("svg, i");
    if (existingIcon) {
        existingIcon.remove();
    }

    const iconPlaceholder = document.createElement("i");
    iconPlaceholder.setAttribute("data-lucide", isDark ? "sun" : "moon");
    themeToggleButton.insertBefore(iconPlaceholder, themeLabel);
    lucide.createIcons();
}

function initializeTheme() {
    const storedTheme = localStorage.getItem(themeStorageKey);
    const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(storedTheme || (preferredDark ? "dark" : "light"));
}

function updateTime() {
    const newTime = new Date().toLocaleString("de-CH", {
        timeZone: "Europe/Zurich",
        hour: "2-digit",
        minute: "2-digit"
    });

    timeElement.textContent = newTime;
}

function updateAge() {
    const birthDate = new Date(2008, 6, 26);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age -= 1;
    }

    ageElement.textContent = `${age}yo`;
}

function createButton(buttonElement, config, fallback) {
    if (!config || !config.text) {
        buttonElement.style.display = "none";
        return;
    }

    const classesToAdd = config.icon.split(" ").filter(cls => cls.trim() !== "");

    buttonElement.querySelector("span").textContent = config.text;
    const iconElement = buttonElement.querySelector("i");
    classesToAdd.forEach(cls => iconElement.classList.add(cls));
    buttonElement.href = config.href || fallback.href;
    buttonElement.target = config.openInNewTab ? "_blank" : "_self";
    buttonElement.rel = config.openInNewTab ? "noreferrer" : "";
}

async function renderProjects() {
    for (const project of PROJECTS) {
        const card = cardTemplate.content.firstElementChild.cloneNode(true);
        const titleElement = card.querySelector(".card-header");
        const descriptionElement = card.querySelector(".card-description");
        const imageElement = card.querySelector(".card-image");
        const topButton = card.querySelector(".top-button");
        const bottomButton = card.querySelector(".bottom-button");
        const tagsContainer = card.querySelector(".card-tags");
        const cardBottomContainer = card.querySelector(".card-bottom");

        titleElement.textContent = project.title;
        descriptionElement.textContent = project.description;

        imageElement.src = project.image;
        imageElement.alt = `${project.title} project image`;

        topButton.href = project.downloadLink;
        bottomButton.href = project.sourceLink;

        if (project.overrideButtons) {
            createButton(topButton, {
                text: project.topButton.text,
                icon: project.topButton.icon,
                href: project.downloadLink,
                openInNewTab: project.topButton.openInNewTab
            }, {
                icon: "download",
                href: project.downloadLink
            });

            createButton(bottomButton, {
                text: project.bottomButton.text,
                icon: project.bottomButton.icon,
                href: project.sourceLink,
                openInNewTab: project.bottomButton.openInNewTab
            }, {
                icon: "code-2",
                href: project.sourceLink
            });
        }

        project.tags.forEach((tag) => {
            const tagElement = document.createElement("span");
            tagElement.className = `card-tag tag-${tag.color}`;
            tagElement.textContent = tag.text;
            tagsContainer.appendChild(tagElement);
        });

        if (project.slug) {
            const { downloads, likes } = await getModrinthStats(project.slug);
            const modrinthStatsContainer = document.createElement("div");
            modrinthStatsContainer.className = "modrinth-stats";
            modrinthStatsContainer.innerHTML = `
                <div class="modrinth-stat">
                    <i class="bi bi-download"></i>
                    <span class="modrinth-downloads">${downloads}</span>
                </div>
                <div class="modrinth-stat">
                    <i class="bi bi-heart"></i>
                    <span class="modrinth-likes">${likes}</span>
                </div>
            `;

            cardBottomContainer.appendChild(modrinthStatsContainer);
        }

        cardContainer.appendChild(card);
    }
}

async function getModrinthStats(slug) {
    const API_URL = `https://api.modrinth.com/v2/project/${slug}`;

    const existingStats = localStorage.getItem(`modrinth-stats-${slug}`);
    if (existingStats) {
        try {
            const parsed = JSON.parse(existingStats);
            const timeCashed = parsed.timestamp;
            const now = Date.now();

            // cache for 1 hour
            if (now - timeCashed < 3600000) {
                return {
                    downloads: parsed.downloads,
                    likes: parsed.likes
                };
            }
        } catch (error) {
            console.warn(`Failed to parse cached stats for ${slug}:`, error);
            localStorage.removeItem(`modrinth-stats-${slug}`);
        }
    }
    
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch stats for ${slug}: ${response.statusText}`);
        }

        const data = await response.json();

        localStorage.setItem(`modrinth-stats-${slug}`, JSON.stringify({
            timestamp: Date.now(),
            downloads: data.downloads || 0,
            likes: data.followers || 0
        }));

        return {
            downloads: data.downloads || 0,
            likes: data.followers || 0
        };
    } catch (error) {
        console.error(error);
        return {
            downloads: "N/A",
            likes: "N/A"
        };
    }
}

initializeTheme();
initSkinViewer();
updateAge();
updateTime();
setInterval(updateTime, 1000);
renderProjects();
lucide.createIcons();

themeToggleButton.addEventListener("click", () => {
    const nextTheme = htmlElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(nextTheme);
});
