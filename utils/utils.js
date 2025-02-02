/// <reference types="../../CTAutocomplete" />
import Dungeon from "../../BloomCore/dungeons/Dungeon";


const romanHash = {
    I: 1,
    V: 5,
    X: 10,
}

export function romanToInt(s) {
    let accumulator = 0
    for (let i = 0; i < s.length; i++) {
        if (s[i] === 'I' && (s[i + 1] === 'V' || s[i + 1] === 'X')) {
            accumulator += romanHash[s[i + 1]] - romanHash[s[i]]
            i++
        } else {
            accumulator += romanHash[s[i]]
        }
    }
    return accumulator
}


export function isInDungeon() {
    try {
        return TabList?.getNames()?.some(a => a.removeFormatting() == 'Dungeon: Catacombs')
    } catch (e) { }
}

export function getCurrentDungeonMode() {
    try {
        return Dungeon.dungeonType
    } catch (e) { }
}

export function getCurrentDungeonFloor() {
    try {
        return Dungeon.floorNumber
    } catch (e) { }
}

export function getArea() {
    let area = 'null'
    try {
        TabList?.getNames()?.forEach(line => {
            let match = line.removeFormatting().match(/Area: (.+)/)
            if (line.removeFormatting() == 'Dungeon: Catacombs') area = 'Dungeons'
            if (!match) return
            area = match[1]
        })
    } catch (e) { }
    return area
}

let inP3 = false;

register('packetReceived', (packet) => {
    if (packet.func_148916_d()) return
    const message = packet.func_148915_c().func_150254_d().removeFormatting()
    if (message == "[BOSS] Storm: I should have known that I stood no chance.") {
        inP3 = true;
    }
    if (message == "The Core entrance is opening!")
        inP3 = false;
}).setFilteredClass(Java.type("net.minecraft.network.play.server.S02PacketChat"))

export function isInP3() { return inP3 }

export function highlightSlot(index, r, g, b, v) {
    const inventorySize = Player.getOpenedInventory().getSize();
    const isChestOpen = inventorySize > 45;
    const chestRows = isChestOpen ? Math.floor((inventorySize - 36) / 9) : 0;
    const chestSize = chestRows * 9;
    const missingRows = 6 - chestRows;
    const chestOffset = 85 - (missingRows * 9);
    const inventoryOffset = missingRows * 9;
    const extraOffsetForInventory = isChestOpen ? 0 : 9;

    const x = index % 9;
    const y = Math.floor(index / 9);
    const renderX = Renderer.screen.getWidth() / 2 + ((x - 4) * 18);
    let renderY;

    if (isChestOpen) {
        if (index < chestSize) {
            renderY = (Renderer.screen.getHeight() / 2) - chestOffset + (y * 18);
        } else if (index >= chestSize && index < chestSize + 27) {
            const adjustedY = y - chestRows;
            renderY = (Renderer.screen.getHeight() / 2) + 36 - inventoryOffset + extraOffsetForInventory + (adjustedY * 18);
        } else {
            const adjustedY = y - chestRows;
            renderY = (Renderer.screen.getHeight() / 2) + 41 - inventoryOffset + extraOffsetForInventory + (adjustedY * 18);
        }
    } else {
        if (index < 36) {
            const adjustedY = y - chestRows;
            renderY = (Renderer.screen.getHeight() / 2) + 36 - inventoryOffset + extraOffsetForInventory + (adjustedY * 18);
        } else {
            const adjustedY = y - chestRows;
            renderY = (Renderer.screen.getHeight() / 2) + 40.5 - inventoryOffset + extraOffsetForInventory + (adjustedY * 18);
        }
    }

    Renderer.translate(0, 0, 100);
    Renderer.drawRect(Renderer.color(r, g, b, v), renderX - 9, renderY - 9, 17, 17);
}