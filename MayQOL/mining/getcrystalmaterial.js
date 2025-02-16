/// <reference types="../../CTAutocomplete" />
import config from "../config"


register("command", (type) => {
    executeGetcrystalmaterial(type);
}).setName("getcrystalmaterial").setAliases("gcm");

// --- Sapphire Crystal ---

const autocrystalmaterialsapphire = register("chat", () => {
    if (!config.autocrystalmaterialsapphire) return;
    getCrystalMaterialSapphire();
    autocrystalmaterialsapphire.unregister();
    setTimeout(() => {
        autocrystalmaterialsapphire.register();
    }, 50000);
}).setCriteria("[NPC] Professor Robot: That's not one of the components I need! Bring me one of the missing components:");

autocrystalmaterialsapphire.register()

function getCrystalMaterialSapphire() {
    missingComponents = [];
    const temporaryTrigger = register("chat", (message) => {
        if (isRequiredComponent(message)) {
            missingComponents.push(message.trim());
        }
    }).setCriteria("  ${message}");

    setTimeout(() => {
        getMaterialsFromSack(missingComponents, "1");
        temporaryTrigger.unregister();
    }, 100);
}

function isRequiredComponent(message) {
    const requiredComponents = [
        "Electron Transmitter",
        "FTX 3070",
        "Robotron Reflector",
        "Superlite Motor",
        "Control Switch",
        "Synthetic Heart"
    ];
    return requiredComponents.some(component => message.includes(component));
}

// --- Amber Crystal ---

const autocrystalmaterialamber = register("chat", (message) => {
    if (!config.autocrystalmaterialamber) return;
    getMaterialsFromSack(["goblin_egg"], config.kingYolkarGoblinEggsRequired);
    autocrystalmaterialamber.unregister();
    setTimeout(() => {
        autocrystalmaterialamber.register();
    }, 50000);
}).setCriteria("[NPC] King Yolkar: Bring me back ${message}");

autocrystalmaterialamber.register()

// --- Amethyst Crystal ---

const autocrystalmaterialamethyst = register("chat", () => {
    if (!config.autocrystalmaterialamethyst) return;
    getMaterialsFromSack(["jungle_key"], "1");
    autocrystalmaterialamethyst.unregister();
    setTimeout(() => {
        autocrystalmaterialamethyst.register();
    }, 50000);
}).setCriteria("[NPC] Kalhuiki Door Guardian: This temple is locked, you will need to bring me a key to open the door!");

autocrystalmaterialamethyst.register()

// --- general ---

function getMaterialsFromSack(materials, amount) {
    materials.forEach(material => {
        ChatLib.command(`gfs ${material} ${amount}`)
    });
}

function executeGetcrystalmaterial(type) {
    switch (type.toLowerCase()) {
        case "sapphire":
            getMaterialsFromSack(["electron_transmitter", "ftx_3070", "robotron_reflector", "control_switch", "superlite_motor", "synthetic_heart"], "1");
            break;

        case "amber":
            getMaterialsFromSack(["goblin_egg"], config.kingYolkarGoblinEggsRequired);
            break;

        case "amethyst":
            getMaterialsFromSack(["jungle_key"], "1");
            break;

        default:
            ChatLib.chat(`Invalid type: ${type}`);
    }
}