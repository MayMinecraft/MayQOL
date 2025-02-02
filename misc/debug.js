/// <reference types="../../CTAutocomplete" />
import config from "../config";
import { registerWhen } from '../../BloomCore/utils/Utils'
import { getArea } from '../utils/utils'


register('command', () => {
    ChatLib.chat("Hi")
}).setName('test')

registerWhen(register('tick', () => {
    const inventory = Player.getOpenedInventory();

    // The ID for sponge is 19.
    const spongeSlot = inventory.indexOf(19);

    if (spongeSlot !== -1) {
        ChatLib.chat("Sponge found in slot " + spongeSlot + "!");
    }
}), () => config.debugSpongeTest)

registerWhen(register("worldLoad", () => {
    setTimeout(() => {
        ChatLib.chat(new Message("[MayQOL] [Debug] Current Area: " + getArea()))
    }, 1000)
}), () => config.debugAreaOnJoin)