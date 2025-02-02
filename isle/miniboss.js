/// <reference types="../../CTAutocomplete" />
import config from '../config'
import RenderLib from '../../RenderLib/index'
import { registerWhen } from '../../BloomCore/utils/Utils'

registerWhen(register("renderEntity", (entity, pos, partialTicks, event) => {
    let name = entity.getName()

    const espBox = (x, y, z, height, r, g, b) => {
        RenderLib.drawEspBox(x, y - height, z, 0.9, height, r, g, b, 1, true)
    }

    if (name.includes("Barbarian Duke X")) {
        espBox(entity.getX(), entity.getY(), entity.getZ(), 1.9, 1, 0, 0)
    } else if (name.includes("Mage Outlaw")) {
        espBox(entity.getX(), entity.getY(), entity.getZ(), 1.9, 0, 0, 1)
    } else if (name.includes("Bladesoul")) {
        espBox(entity.getX(), entity.getY() - 0.2, entity.getZ(), 4.7, 0, 0, 0)
    }
}), () => config.crimsonIsleMiniBossESP)