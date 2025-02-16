import { isInDungeon, highlightSlot } from "../utils/utils";
import config from "../config"

let options = ['None', 'Archer', 'Mage', 'Bers', 'Tank', 'Healer']
let hasDungeonStarted = false
let assignedClasses = false
let classes = {}
const regex = /^\[(?:\d+)\] (?:\[\w+\] )*(\w+) (?:.)*?\((\w+)(?: (?:\w+))*\)$/

register('worldLoad', () => {
    hasDungeonStarted = false
    assignedClasses = false
    classes = {}
})

register('step', () => {
    if (!isInDungeon() || config.leapHighlight == 0) return
    if (assignedClasses) return
    if (!hasDungeonStarted) {
        if (Scoreboard.getLines().findIndex(line => line?.getName()?.includes('Time Elapsed:')) != -1) hasDungeonStarted = true
    }

    if (hasDungeonStarted) {
        let players = TabList.getNames().filter(line => regex.test(line.removeFormatting()))
        players.forEach(player => {
            let match = player.removeFormatting().match(regex)
            if (!match) return
            classes[match[1]] = `${match[2]}`
        })
        assignedClasses = true
    }
}).setFps(3)

let indices = []
register('guiOpened', () => {
    if (config.leapHighlight == 0) return
    Client.scheduleTask(1, () => {
        if (Player.getContainer()?.getName() != 'Spirit Leap') return
        let names = Object.keys(classes).filter(key => classes[key] == options[config.leapHighlight])
        indices = []
        Player.getContainer()?.getItems()?.forEach((item, index) => {
            if (names.includes(item?.getName()?.removeFormatting())) indices.push(index)
        })
    })
})


register('guiRender', () => {
    if (Player.getContainer()?.getName() != 'Spirit Leap' || config.leapHighlight == 0 || !indices) return
    indices.forEach((slot) => {
        highlightSlot(slot, config.leapColor.getRed(), config.leapColor.getGreen(), config.leapColor.getBlue(), config.leapColor.getAlpha())
    })
})

