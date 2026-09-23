/**
 * Project cards, rendered in this order.
 *
 * tags            plain strings; language names are highlighted automatically
 * slug            Modrinth project slug — downloads/followers are fetched live
 * stats           manual stats, for projects that aren't on Modrinth
 * overrideButtons replace the default Modrinth / Source buttons
 */
const PROJECTS = [
    {
        title: "PluginWizard",
        description: "A visual editor that lets anybody build a Minecraft plugin without writing code.",
        image: "./images/wizard.png",
        downloadLink: "#projects",
        sourceLink: "https://github.com/PluginWizard",
        overrideButtons: true,
        topButton: {
            text: "Coming soon",
            icon: "bi bi-clock",
            openInNewTab: false
        },
        bottomButton: {
            text: "GitHub org",
            icon: "bi bi-github",
            openInNewTab: true
        },
        tags: ["TypeScript", "Java", "Kotlin", "Electron", "Minecraft"],
        stats: [
            { icon: "bi bi-people", value: "2" },
            { icon: "bi bi-star", value: "6" }
        ]
    },
    {
        title: "PluginWizard-Core",
        description: "A Java library that takes the boilerplate out of plugin development — commands, config and events, minus the ceremony.",
        image: "./images/pluginwizard-core.svg",
        downloadLink: "https://central.sonatype.com/artifact/net.kalbskinder/pluginwizard-core",
        sourceLink: "https://github.com/PluginWizard/PluginWizard-Core",
        overrideButtons: true,
        topButton: {
            text: "Maven Central",
            icon: "bi bi-box-seam",
            openInNewTab: true
        },
        bottomButton: {
            text: "Source",
            icon: "bi bi-code-slash",
            openInNewTab: true
        },
        tags: ["Java", "Library", "Maven"],
        stats: [
            { icon: "bi bi-star", value: "2" }
        ]
    },
    {
        title: "Mob Health",
        description: "A configurable plugin that shows every mob's remaining health above its head.",
        image: "https://cdn.modrinth.com/data/VLCY8WJF/e3fc91f78b0b84c22d2df1252edb3e2099ea7444.png",
        downloadLink: "https://modrinth.com/plugin/mob-health",
        sourceLink: "https://github.com/Kalbskinder/MobHealthV2",
        tags: ["Java", "PaperMC"],
        slug: "mob-health"
    },
    {
        title: "Lobby Parkour",
        description: "A lightweight parkour system for modern Minecraft lobbies, with checkpoints and per-course leaderboards.",
        image: "https://cdn.modrinth.com/data/p0vLoLma/776a52b513a2ab1d46fbfd8cdc5e53784f89e044.webp",
        downloadLink: "https://modrinth.com/plugin/lobby-parkour",
        sourceLink: "https://github.com/Crumb-Network/Lobby-Parkour",
        tags: ["Java", "PaperMC"],
        slug: "lobby-parkour"
    },
    {
        title: "Infection",
        description: "The Infection minigame as a drop-in plugin: teams, rounds and win conditions handled for you.",
        image: "https://cdn.modrinth.com/data/5RQMBtQG/751ef8394583803f190a4e8d8cf9e9eb9e344406.png",
        downloadLink: "https://modrinth.com/plugin/infection-minigame",
        sourceLink: "https://github.com/Kalbskinder/Infection",
        tags: ["Java", "PaperMC", "Minigame"],
        slug: "infection-minigame"
    },
    {
        title: "Crumb Lobby",
        description: "An easy-to-configure lobby plugin with the essentials and nothing you'd have to switch off.",
        image: "https://cdn.modrinth.com/data/b5si1ZrM/443bdbde014369fffb07b6491970340ed8c4dbbb_96.webp",
        downloadLink: "https://modrinth.com/plugin/crumb-lobby",
        sourceLink: "https://github.com/Crumb-Network/Crumb-Lobby",
        tags: ["Java", "PaperMC"],
        slug: "crumb-lobby"
    }
];
