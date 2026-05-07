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
            icon: "clock-3"
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
        ]
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
        ]
    },
    {
        title: "Patient-Zero",
        description: "A Minecraft plugin that brings Hypixel-style infection gameplay to your server.",
        image: "https://cdn.modrinth.com/data/5RQMBtQG/751ef8394583803f190a4e8d8cf9e9eb9e344406.png",
        downloadLink: "https://modrinth.com/plugin/patient-zero",
        sourceLink: "https://github.com/Kalbskinder/Patient-Zero",
        overrideButtons: false,
        tags: [
            { text: "Java", color: "green" },
            { text: "Minecraft", color: "blue" },
            { text: "PaperMC", color: "blue" }
        ]
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
        ]
    }
];
