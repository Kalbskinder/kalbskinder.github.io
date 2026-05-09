const PROJECTS = [
    {
        title: "PluginWizard",
        description: "A visual tool that lets anybody create a Minecraft plugin without coding experience.",
        image: "./images/wizard.png",
        downloadLink: "#projects",
        sourceLink: "https://github.com/PluginWizard",
        overrideButtons: true,
        topButton: {
            openInNewTab: false,
            text: "Coming Soon",
            icon: "bi bi-clock"
        },
        bottomButton: {
            openInNewTab: true,
            text: "GitHub Org.",
            icon: "bi bi-github"
        },
        tags: [
            { text: "TypeScript", color: "green" },
            { text: "Java", color: "green" },
            { text: "Minecraft", color: "blue" }
        ],
        stat: {
            icon: "bi bi-people",
            value: "1"
        }
    },
    {
        title: "PluginWizard-Core",
        description: "A Java library that simplifies plugin development by providing a collection of utilities and abstractions for common tasks.",
        image: "./images/pluginwizard-core.svg",
        downloadLink: "https://central.sonatype.com/artifact/net.kalbskinder/pluginwizard-core",
        sourceLink: "https://github.com/PluginWizard/PluginWizard-Core",
        overrideButtons: true,
        topButton: {
            openInNewTab: true,
            text: "Maven Central",
            icon: "bi bi-download"
        },
        bottomButton: {
            openInNewTab: true,
            text: "View Source",
            icon: "bi bi-code-slash"
        },
        tags: [
            { text: "Java", color: "green" },
            { text: "Library", color: "yellow" },
            { text: "Minecraft", color: "blue" }
        ],
        stat: {
            icon: "bi bi-star",
            value: "2"
        }
    },
    {
        title: "Infection",
        description: "A Minecraft plugin that adds the popular Infection minigame to your server.",
        image: "https://cdn.modrinth.com/data/5RQMBtQG/751ef8394583803f190a4e8d8cf9e9eb9e344406.png",
        downloadLink: "https://modrinth.com/plugin/infection-minigame",
        sourceLink: "https://github.com/Kalbskinder/Infection",
        overrideButtons: false,
        tags: [
            { text: "Java", color: "green" },
            { text: "Minecraft", color: "blue" },
            { text: "PaperMC", color: "blue" }
        ],
        slug: "infection-minigame"
    },
    {
        title: "Lobby Parkour",
        description: "A lightweight and customizable parkour plugin for modern Minecraft lobbies.",
        image: "https://cdn.modrinth.com/data/p0vLoLma/776a52b513a2ab1d46fbfd8cdc5e53784f89e044.webp",
        downloadLink: "https://modrinth.com/plugin/lobby-parkour",
        sourceLink: "https://github.com/Crumb-Network/Lobby-Parkour",
        overrideButtons: false,
        tags: [
            { text: "Java", color: "green" },
            { text: "Minecraft", color: "blue" },
            { text: "PaperMC", color: "blue" }
        ],
        slug: "lobby-parkour"
    },
    {
        title: "Mob Health",
        description: "A customizable plugin that displays the health count of a mob above their head",
        image: "https://cdn.modrinth.com/data/VLCY8WJF/e3fc91f78b0b84c22d2df1252edb3e2099ea7444.png",
        downloadLink: "https://modrinth.com/plugin/mob-health",
        sourceLink: "https://github.com/Kalbskinder/MobHealthV2",
        overrideButtons: false,
        tags: [
            { text: "Java", color: "green" },
            { text: "Minecraft", color: "blue" },
            { text: "PaperMC", color: "blue" }
        ],
        slug: "mob-health"
    },
    {
        title: "Crumb Lobby",
        description: "A lightweight and easy-to-configure lobby plugin with all essential features.",
        image: "https://cdn.modrinth.com/data/b5si1ZrM/443bdbde014369fffb07b6491970340ed8c4dbbb_96.webp",
        downloadLink: "https://modrinth.com/plugin/crumb-lobby",
        sourceLink: "https://github.com/Crumb-Network/Crumb-Lobby",
        overrideButtons: false,
        tags: [
            { text: "Java", color: "green" },
            { text: "Minecraft", color: "blue" },
            { text: "PaperMC", color: "blue" }
        ],
        slug: "crumb-lobby"
    }
];
