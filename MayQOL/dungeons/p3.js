import config from "../config"
import { isInP3 } from "../utils/utils"


register('guiOpened', () => {
    if (!isInP3()) return
    Client.scheduleTask(2, () => {
        if (Player?.getContainer()?.getName() != 'Click the button on time!') return
        claySlots = new Map([
            [25, `pc ${config.melodyText} 1/4`],
            [34, `pc ${config.melodyText} 2/4`],
            [43, `pc ${config.melodyText} 3/4`]
        ])
        if (!config.announceMelody) return
        ChatLib.command(`pc ${config.melodyText}`)
    })
})

let claySlots = new Map([
    [25, `pc ${config.melodyText} 1/4`],
    [34, `pc ${config.melodyText} 2/4`],
    [43, `pc ${config.melodyText} 3/4`]
])

register('step', () => {
    if (!isInP3() || Player?.getContainer()?.getName() != 'Click the button on time!' || !config.melodyProgress) return

    let greenClays = Array.from(claySlots.keys()).filter(index => Player?.getContainer()?.getItems()[index]?.getMetadata() == 5)
    if (!greenClays.length) return

    ChatLib.command(claySlots.get(greenClays[greenClays.length - 1]))
    greenClays.forEach(clay => claySlots.delete(clay))
    greenClays = []
}).setFps(5)