/// <reference types="../../CTAutocomplete" />
import { registerWhen } from "../../BloomCore/utils/Utils";
import config from "../config"

let combining = false
let checking = false
let pleaseCheck = false

const resetModule = () => {
    combining = false
    checking = false
}

const findAndShiftClickBooks = () => {
    const inventory = Player.getOpenedInventory();
    if (!inventory) {
        ChatLib.chat(" [Debug] MayQOL >> Please open Anvil!");
        return;
    }

    const slots = inventory.getItems();
    const enchantedBooks = [];

    // Iterate through the inventory to find enchanted books
    for (let i = 54; i < 89; i++) {
        const item = slots[i];
        if (item && item.getRawNBT()) {
            try {
                const rawNBT = item.getRawNBT();

                // Check if the item is an enchanted book
                if (rawNBT.includes("id:\"ENCHANTED_BOOK\"")) {
                    const enchantmentsMatch = rawNBT.match(/enchantments:\{([^}]*)\}/);
                    if (enchantmentsMatch) {
                        const enchantments = enchantmentsMatch[1].split(",");

                        for (const enchantment of enchantments) {
                            const [key, level] = enchantment.split(":");
                            if (key && level) {
                                const parsedLevel = parseInt(level.trim());
                                if (parsedLevel >= 1 && parsedLevel <= 4) {
                                    enchantedBooks.push({ slot: i, internalName: key.trim(), level: parsedLevel });
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(`Error processing NBT for slot ${i}: ${e.message}`);
            }
        }
    }

    // Find two books with the same internalName and level
    for (let i = 0; i < enchantedBooks.length; i++) {
        for (let j = i + 1; j < enchantedBooks.length; j++) {
            const book1 = enchantedBooks[i];
            const book2 = enchantedBooks[j];

            if (book1.internalName === book2.internalName && book1.level === book2.level) {
                setTimeout(() => {
                    inventory.click(book1.slot, true, "LEFT")
                    setTimeout(() => {
                        inventory.click(book2.slot, true, "LEFT")
                        pleaseCheck = true
                    }, 250)
                }, 250)
                return
            }
        }
    }

    combining = false
}

const checkSlotsForMatchingBooks = () => {
    const inventory = Player.getOpenedInventory();
    if (!inventory) {
        return false;
    }

    const slot22 = inventory.getStackInSlot(22);

    if (!slot22) {
        return false
    };

    // Check if the item in slot 22 matches the "Combine Items" item
    const item22NBT = slot22.getRawNBT();
    if (item22NBT.toString().includes("Click to combine!")) {

        const slot29 = inventory.getStackInSlot(29);
        const slot33 = inventory.getStackInSlot(33);

        // If both slots have items, check if they are enchanted books with the same enchantments
        if (slot29 && slot33) {
            const item29NBT = slot29.getRawNBT();
            const item33NBT = slot33.getRawNBT();

            if (item29NBT.includes("id:\"ENCHANTED_BOOK\"") && item33NBT.includes("id:\"ENCHANTED_BOOK\"")) {
                const enchantments29 = extractEnchantments(item29NBT);
                const enchantments33 = extractEnchantments(item33NBT);

                // Compare the enchantments and their levels
                if (areEnchantmentsEqual(enchantments29, enchantments33)) {
                    return true;
                }
            }
        }
    }

    return false;
};

// Function to extract enchantments from an item's NBT
const extractEnchantments = (rawNBT) => {
    const enchantments = [];
    const enchantmentsMatch = rawNBT.match(/enchantments:\{([^}]*)\}/);
    if (enchantmentsMatch) {
        const enchantmentsList = enchantmentsMatch[1].split(",");
        enchantmentsList.forEach(enchantment => {
            const [key, level] = enchantment.split(":");
            if (key && level) {
                enchantments.push({
                    internalName: key.trim(),
                    level: parseInt(level.trim())
                });
            }
        });
    }
    return enchantments;
};

// Function to compare two arrays of enchantments and their levels
const areEnchantmentsEqual = (enchantments1, enchantments2) => {
    if (enchantments1.length !== enchantments2.length) {
        return false;
    }

    for (let i = 0; i < enchantments1.length; i++) {
        const enchantment1 = enchantments1[i];
        const enchantment2 = enchantments2[i];

        if (enchantment1.internalName !== enchantment2.internalName || enchantment1.level !== enchantment2.level) {
            return false;
        }
    }

    return true;
};

const itemsToClaim = () => {
    combining = true
    const inventory = Player.getOpenedInventory()
    const slot22 = inventory.getStackInSlot(22)
    if (!inventory || !slot22) {
        return
    }

    // Check if the item in slot 22 matches the "" item
    const item22NBT = slot22.getRawNBT();
    if (item22NBT.toString().includes("Claim the result item above!")) {
        setTimeout(() => {
            inventory.click(22, false, "MIDDLE")
            resetModule()
            combining = false
        }, 250);
        return
    }
    combining = false
}

register("guiClosed", () => {
    resetModule()
})

registerWhen(register("guiRender", () => {

    if (!config.autoAnvilBookCombine) return;
    if (!Player.getOpenedInventory()) return;

    const currentGui = Client.getMinecraft().field_71462_r;
    const guiName = currentGui?.getClass()?.getSimpleName?.();
    if (!guiName || !Player.getOpenedInventory().getName().includes("Anvil")) return;
    if (!combining) {
        combining = true
        findAndShiftClickBooks()
    }
}), () => config.autoAnvilBookCombine && !combining);

registerWhen(register("guiRender", () => {
    if (checking || !pleaseCheck) return
    checking = true
    const inventory = Player.getOpenedInventory()
    if (checkSlotsForMatchingBooks()) {
        pleaseCheck = false
        setTimeout(() => {
            inventory.click(22, false, "LEFT")
            setTimeout(() => {
                inventory.click(22, false, "LEFT")
                resetModule()
            }, 250);
        }, 250);
        return
    } 

    checking = false
}), () => config.autoAnvilBookCombine && pleaseCheck && !checking)