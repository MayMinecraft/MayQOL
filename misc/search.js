/// <reference types="../../CTAutocomplete" />
import { data } from '../data/data';
import config from "../config";
import { registerWhen } from '../../BloomCore/utils/Utils'
import { highlightSlot } from '../utils/utils';

const GuiTextField = Java.type("net.minecraft.client.gui.GuiTextField");
let searchGUI = new GuiTextField(0, Client.getMinecraft().field_71466_p, data.searchCoords.x, data.searchCoords.y, 100, 10);
let searchTerm = "";
let globalMatchingSlots = [];

// Check if there is space in the player's inventory
function isInventorySpaceAvailable() {
    const inventory = Player.getOpenedInventory();
    if (!inventory) return false;
    const items = inventory.getItems();
    for (let i = inventory.getSize() - 36; i < inventory.getSize(); i++) {
        if (!items[i]) return true; // If there's an empty slot
    }
    return false;
}

// Move matching items to the player's inventory
function moveMatchingItemsToInventory(title, invert) {
    let itemsToMove = [...globalMatchingSlots];
    const inventory = Player.getOpenedInventory();
    if (!inventory || !config.inventorySearchMoveMatchingItems || itemsToMove.length === 0) return;

    const moveItem = (currentIndex) => {
        if (currentIndex >= itemsToMove.length) return;
        if (invert ? itemsToMove[currentIndex] <= (inventory.getSize() - 37) : itemsToMove[currentIndex] > (inventory.getSize() - 37)) return;
        if (Player.getOpenedInventory().getName() != title) return
        if (!isInventorySpaceAvailable() && !invert) return
        if (currentIndex < 0) return
        inventory.click(itemsToMove[currentIndex], true, "LEFT");
        setTimeout(() => moveItem(currentIndex + (invert ? -1 : 1)), 75); // Delay between moving items
    };

    moveItem((invert ? (itemsToMove.length - 1) : 0));
}

// Render the "Move Items" button
registerWhen(register('guiRender', () => {
    if (!config.inventorySearchMoveMatchingItems) return;
    if (!Player.getOpenedInventory()) return;

    const currentGui = Client.getMinecraft().field_71462_r;
    const guiName = currentGui?.getClass()?.getSimpleName?.();

    if (!guiName || !["GuiChest"].includes(guiName)) return;

    Renderer.drawRect(Renderer.color(160, 160, 160, 200), data.searchCoords.x - 1, data.searchCoords.y + 14, 39, 18);
    Renderer.drawRect(Renderer.color(0, 0, 0, 200), data.searchCoords.x, data.searchCoords.y + 15, 37, 16);
    Renderer.drawStringWithShadow("dump", data.searchCoords.x + 6, data.searchCoords.y + 19);
    Renderer.drawRect(Renderer.color(160, 160, 160, 200), data.searchCoords.x + 41, data.searchCoords.y + 14, 60, 18);
    Renderer.drawRect(Renderer.color(0, 0, 0, 200), data.searchCoords.x + 42, data.searchCoords.y + 15, 58, 16);
    Renderer.drawStringWithShadow("withdraw", data.searchCoords.x + + 49, data.searchCoords.y + 19);
}), () => config.inventorySearchMoveMatchingItems);

// Handle mouse click to trigger the "Move Items" function
registerWhen(register('GuiMouseClick', (gui) => {
    if (!config.inventorySearchMoveMatchingItems) return;
    if (!Player.getOpenedInventory()) return;

    const currentGui = Client.getMinecraft().field_71462_r;
    const guiName = currentGui?.getClass()?.getSimpleName?.();

    if (!guiName || !["GuiChest"].includes(guiName)) return;

    const scaledWidth = Renderer.screen.getWidth();
    const scaledHeight = Renderer.screen.getHeight();

    const mouseX = Client.getMouseX() * (scaledWidth / Renderer.screen.getWidth());
    const mouseY = Client.getMouseY() * (scaledHeight / Renderer.screen.getHeight());

    if (
        mouseX >= data.searchCoords.x &&
        mouseX <= data.searchCoords.x + 100 &&
        mouseY >= data.searchCoords.y + 14 &&
        mouseY <= data.searchCoords.y + 32
    ) {
        moveMatchingItemsToInventory(Player.getOpenedInventory().getName(), mouseX > data.searchCoords.x + 40 ? false : true);
    }
}), () => config.inventorySearchMoveMatchingItems);

// Update the search term in each tick and manage focus
registerWhen(register("tick", () => {
    if (!config.inventorySearch) return;
    if (!Player.getOpenedInventory()) return;

    if (!Client.isInGui()) {
        searchGUI.func_146195_b(false); // Remove focus when not in GUI
    } else {
        searchTerm = searchGUI.func_146179_b(); // Update search term
    }
}), () => config.inventorySearch);

// Render the search bar when in inventory or chest GUI
registerWhen(register("guiRender", () => {
    if (!config.inventorySearch) return;
    if (!Player.getOpenedInventory()) return;

    const currentGui = Client.getMinecraft().field_71462_r;
    const guiName = currentGui?.getClass()?.getSimpleName?.();

    if (!guiName || !["GuiChest", "GuiInventory"].includes(guiName)) return;

    try {
        searchGUI.func_146194_f(); // Draw the search bar
        Renderer.drawStringWithShadow('Search Item', data.searchCoords.x, data.searchCoords.y - 10);
    } catch (e) {
        Console.println(e);
    }
}), () => config.inventorySearch);

// Handle mouse click to focus the search bar
registerWhen(register("guiMouseClick", (x, y, button) => {
    if (Player.getPlayer() === null || Player.getOpenedInventory() === null) return;

    const currentGui = Client.getMinecraft().field_71462_r;
    const guiName = currentGui?.getClass()?.getSimpleName?.();

    if (!guiName || !["GuiChest", "GuiInventory"].includes(guiName)) return;

    searchGUI.func_146192_a(x, y, button); // Detect click to focus search bar
}), () => config.inventorySearch);

// Handle keyboard input to update the search bar content
registerWhen(register("guiKey", (char, keyCode, gui, event) => {
    if (!config.inventorySearch) return;

    if (searchGUI.func_146206_l()) { // If search bar is focused
        searchGUI.func_146201_a(char, keyCode); // Add character to the search bar
        if (keyCode !== 1) { // Escape key
            cancel(event); // Prevent further processing of the key
        }
    }
}), () => config.inventorySearch);

// Highlight items matching the search term
registerWhen(register('guiRender', (gui) => {
    if (!config.inventorySearch) return;
    if (Player.getPlayer() === null || Player.getOpenedInventory() === null) return;

    const currentGui = Client.getMinecraft().field_71462_r;
    const guiName = currentGui?.getClass()?.getSimpleName?.();

    if (!guiName || guiName.trim() == "" || !["GuiChest", "GuiInventory"].includes(guiName) || searchTerm == "") return;

    const inventorySize = Player.getOpenedInventory().getSize();
    if (inventorySize < 45) return;

    const items = Player.getOpenedInventory().getItems();

    let matchingSlots = [];

    items.forEach((item, index) => {
        if (item === null || item.getRawNBT().removeFormatting().includes('id:"minecraft:air"')) return;
        if (!config.inventorySearchIncludePhrase) config.inventorySearchNBTData = false;
        if (Player.getOpenedInventory().getName().includes("Backpack") && index < 9 || Player.getOpenedInventory().getName().includes("Ender Chest") && index < 9) return
        if (
            (config.inventorySearchNBTData && item.getRawNBT().toLowerCase().removeFormatting().includes(searchTerm.toLowerCase())) ||
            (!config.inventorySearchIncludePhrase ?
                item.getName().toLowerCase().removeFormatting() === searchTerm.toLowerCase() :
                item.getName().toLowerCase().removeFormatting().includes(searchTerm.toLowerCase())) && searchTerm
        ) {

            matchingSlots.push(index)
            highlightSlot(index, 0, 247, 0, 200)
        }
    });

    globalMatchingSlots = [...matchingSlots];
}), () => config.inventorySearch);