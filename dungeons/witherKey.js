/// <reference types="../../CTAutocomplete" />
import config from '../config'
import RenderLib from '../../RenderLib/index'
import { registerWhen } from '../../BloomCore/utils/Utils'
import { isInDungeon } from '../utils/utils'

const EntityArmorStand = Java.type('net.minecraft.entity.item.EntityArmorStand')

let bloodOpened = false

register('worldUnload', () => {
    bloodOpened = false
})

register('chat', () => {
    bloodOpened = true
}).setCriteria(/\[BOSS\] The Watcher: .+/)

registerWhen(register('renderEntity', (entity) => {
    let mcEntity = entity.entity
    if (mcEntity instanceof EntityArmorStand) {

        const isWither = entity.getName()?.includes('Wither Key')
        const isBlood = entity.getName()?.includes('Blood Key')

        if (isWither) {
            RenderLib.drawEspBox(entity.getX(), entity.getY() + 1.15, entity.getZ(), 1, 1, 1, 1, 1, 1, true)
        } else if (isBlood) {
            RenderLib.drawEspBox(entity.getX(), entity.getY() + 1.15, entity.getZ(), 1, 1, 1, 0, 0, 1, true)
        } else return
    }
}), () => config.highlightKeys && isInDungeon() && !bloodOpened)