/// <reference types="../../CTAutocomplete" />
import config from '../config'
import { registerWhen } from '../../BloomCore/utils/Utils'

registerWhen(register("renderEntity", (entity) => {
    const swap = (n) => {
        Player.setHeldItemIndex(n)
    }

    if (entity instanceof Entity) {
        if (Player.lookingAt() instanceof Entity) {
            if (Math.abs(entity.getX() - Player.lookingAt().getX()) <= 0.1 && Math.abs(entity.getZ() - Player.lookingAt().getZ()) <= 0.1 && entity != Player.lookingAt()) {
                let name = entity.getName()
                if (name.includes("Wood")) {
                    swap(0)
                } else if (name.includes("Iron")) {
                    swap(1)
                } else if (name.includes("Gold")) {
                    swap(2)
                } else if (name.includes("Diamond")) {
                    swap(3)
                }
            }
        }
    }
}), () => config.dojoHelperAutoDicipline);