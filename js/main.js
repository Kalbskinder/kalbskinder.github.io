const html = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");
const themeIcon = themeToggle.querySelector("i");
const timeElement = document.getElementById("time");
const cardContainer = document.getElementById("card-container");
const cardTemplate = document.getElementById("project-card-template");
const skinCanvas = document.getElementById("skin-viewer");
const workNote = document.getElementById("work-note");
const publishedFact = document.getElementById("fact-published");

const THEME_KEY = "kalbskinder-theme";
const BIRTH_DATE = new Date(2008, 6, 26);

/** Tags that name a language get the accent treatment; the rest stay quiet. */
const LANGUAGE_TAGS = new Set(["java", "kotlin", "typescript"]);

/* ----------------------------------------------------------------- theme */

function loadMusicWidget() {
    const theme = localStorage.getItem(THEME_KEY) || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    loadWidget(theme, "kalbskinder", 10000);
}

function setTheme(theme) {
    loadMusicWidget();
    const resolved = theme === "dark" ? "dark" : "light";
    html.setAttribute("data-theme", resolved);
    localStorage.setItem(THEME_KEY, resolved);

    const isDark = resolved === "dark";
    themeLabel.textContent = isDark ? "light" : "dark";
    themeIcon.className = isDark ? "bi bi-sun" : "bi bi-moon";
}

function initTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(stored || (prefersDark ? "dark" : "light"));
}

themeToggle.addEventListener("click", () => {
    setTheme(html.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

/* ------------------------------------------------------------ small bits */

function updateTime() {
    timeElement.textContent = new Date().toLocaleTimeString("de-CH", {
        timeZone: "Europe/Zurich",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function renderAge() {
    const today = new Date();
    let age = today.getFullYear() - BIRTH_DATE.getFullYear();
    const monthDiff = today.getMonth() - BIRTH_DATE.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < BIRTH_DATE.getDate())) {
        age -= 1;
    }

    document.querySelectorAll(".js-age").forEach((element) => {
        element.textContent = age;
    });
}

/* ----------------------------------------------------------- skin viewer */

function skinViewerSize() {
    const available = skinCanvas.parentElement.clientWidth;
    return Math.round(Math.min(300, Math.max(200, available)));
}

function initSkinViewer() {
    // If the viewer library fails to load, drop the whole panel rather than
    // leaving a blank canvas and a "drag to spin" hint behind.
    if (typeof skinview3d === "undefined") {
        skinCanvas.parentElement.remove();
        return;
    }

    const size = skinViewerSize();
    const viewer = new skinview3d.SkinViewer({
        canvas: skinCanvas,
        width: size,
        height: size,
        skin: "./images/skin.png",
        cape: "./images/cape.png"
    });

    viewer.fov = 60;
    viewer.zoom = 0.78;
    viewer.autoRotate = false;
    viewer.nameTag = "Kalbskinder";
    viewer.animation = new skinview3d.WalkingAnimation();
    viewer.animation.speed = 0.7;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        viewer.animation.paused = true;
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const next = skinViewerSize();
            viewer.width = next;
            viewer.height = next;
        }, 120);
    });
}

/* -------------------------------------------------------------- projects */

async function getModrinthStats(slug) {
    try {
        const response = await fetch(`https://api.modrinth.com/v2/project/${slug}`);
        if (!response.ok) {
            throw new Error(`Modrinth returned ${response.status} for ${slug}`);
        }

        const data = await response.json();
        return { downloads: data.downloads ?? 0, likes: data.followers ?? 0 };
    } catch (error) {
        console.error(error);
        return null;
    }
}

function formatCount(value) {
    return typeof value === "number" ? value.toLocaleString("en-US") : value;
}

function renderStats(container, stats) {
    container.innerHTML = "";

    stats.forEach(({ icon, value }) => {
        const item = document.createElement("div");
        item.className = "card-stat";

        const iconElement = document.createElement("i");
        iconElement.className = icon;
        iconElement.setAttribute("aria-hidden", "true");

        const valueElement = document.createElement("span");
        valueElement.textContent = formatCount(value);

        item.append(iconElement, valueElement);
        container.appendChild(item);
    });
}

function applyButton(button, config, fallbackHref) {
    if (!config || !config.text) {
        button.remove();
        return;
    }

    button.querySelector("span").textContent = config.text;
    button.querySelector("i").className = config.icon;
    button.href = config.href || fallbackHref;

    if (config.openInNewTab === false) {
        button.removeAttribute("target");
        button.removeAttribute("rel");
    }
}

function buildCard(project) {
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    const image = card.querySelector(".card-image");
    const tagList = card.querySelector(".card-tags");
    const topButton = card.querySelector(".top-button");
    const bottomButton = card.querySelector(".bottom-button");

    card.querySelector(".card-header").textContent = project.title;
    card.querySelector(".card-description").textContent = project.description;

    image.src = project.image;
    image.alt = `${project.title} icon`;

    topButton.href = project.downloadLink;
    bottomButton.href = project.sourceLink;

    if (project.overrideButtons) {
        applyButton(topButton, project.topButton, project.downloadLink);
        applyButton(bottomButton, project.bottomButton, project.sourceLink);
    }

    project.tags.forEach((tag) => {
        const item = document.createElement("li");
        item.className = "card-tag";
        if (LANGUAGE_TAGS.has(tag.toLowerCase())) {
            item.classList.add("is-accent");
        }
        item.textContent = tag;
        tagList.appendChild(item);
    });

    if (project.stats) {
        renderStats(card.querySelector(".card-stats"), project.stats);
    }

    return card;
}

async function renderProjects() {
    const published = [];

    PROJECTS.forEach((project) => {
        const card = buildCard(project);
        cardContainer.appendChild(card);
        if (project.slug) {
            published.push({ slug: project.slug, card });
        }
    });

    const results = await Promise.all(published.map(({ slug }) => getModrinthStats(slug)));

    let totalDownloads = 0;

    results.forEach((stats, index) => {
        const container = published[index].card.querySelector(".card-stats");

        if (!stats) {
            renderStats(container, [{ icon: "bi bi-dash-circle", value: "unavailable" }]);
            return;
        }

        totalDownloads += stats.downloads;
        renderStats(container, [
            { icon: "bi bi-download", value: stats.downloads },
            { icon: "bi bi-heart", value: stats.likes }
        ]);
    });

    if (totalDownloads > 0) {
        const summary = `${formatCount(totalDownloads)} downloads on Modrinth`;
        workNote.textContent = summary;
        publishedFact.textContent = summary;
    }
}

/* ------------------------------------------------------------------ boot */

initTheme();
renderAge();
updateTime();
setInterval(updateTime, 30_000);
initSkinViewer();
renderProjects();
loadMusicWidget();
