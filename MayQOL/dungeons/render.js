/// <reference types="../../CTAutocomplete" />
import { registerWhen, stripRank } from "../../BloomCore/utils/Utils";
import config from "../config";

let watcherstate = 0
let text = new Text('').setScale(4).setShadow(false).setAlign('CENTER');
let ticks = 0

const renderText = register('renderOverlay', () => {
    tickCounter.register()
    text.draw((Renderer.screen.getWidth()) / 2, (Renderer.screen.getHeight()) / 2 - 40)
    if (ticks >= 60) renderText.unregister()
})

const tickCounter = register('tick', () => {
    ticks++
    if (ticks >= 60) tickCounter.unregister()
})

function createTitle(titleText) {
    ticks = 0
    text.setString(titleText)
    renderText.unregister()
    renderText.register()
}

registerWhen(register("chat", () => {
    if (watcherstate > 1) return
    if (config.announceWatcherStatusTitle) {
        createTitle('&r&4Handle Blood&r')
    }
    if (config.announceWatcherStatusChat) ChatLib.command('pc MayQOL >> Ready for blood camp')
    watcherstate = 1
}).setCriteria("[BOSS] The Watcher: Let's see how you can handle this."), () => config.announceWatcherStatusTitle || config.announceWatcherStatusChat)

registerWhen(register("chat", () => {
    if (watcherstate > 2) return
    if (config.announceWatcherStatusTitle) {
        createTitle('&r&4Watcher ready&r')
    }
    if (config.announceWatcherStatusChat) ChatLib.command('pc MayQOL >> Watcher ready to be cleared')
    watcherstate = 2
}).setCriteria("[BOSS] The Watcher: That will be enough for now."), () => config.announceWatcherStatusTitle || config.announceWatcherStatusChat)

registerWhen(register("chat", () => {
    if (watcherstate > 3) return
    if (config.announceWatcherStatusTitle) {
        createTitle('&r&4Blood clear&r')
    }
    if (config.announceWatcherStatusChat) ChatLib.command('pc MayQOL >> Blood cleared')
    watcherstate = 3
    setTimeout(() => watcherstate = 0, 5000)
}).setCriteria("[BOSS] The Watcher: You have proven yourself. You may pass."), () => config.announceWatcherStatusTitle || config.announceWatcherStatusChat)

registerWhen(register("chat", (player, type) => {
    if (player.includes(':')) return
    if (watcherstate > 0) return
    createTitle('&r&a&r&b' + stripRank(player) + '&r&a obtained &r&8&l' + type + ' &r&akey!&r')
}).setCriteria('${player} has obtained ${type} Key!'), () => config.titleOnDungeonKey)

registerWhen(register("chat", () => {
    if (watcherstate > 0) return
    createTitle('&r&eA &r&a&r&6&r&8Wither Key&r&e was picked up!&r')
}).setCriteria('A Wither Key was picked up!'), () => config.titleOnDungeonKey)

registerWhen(register("chat", () => {
    if (watcherstate > 0) return
    createTitle('&r&eA &r&a&r&c&r&cBlood Key&r&e was picked up!&r')
}).setCriteria('A Blood Key was picked up!'), () => config.titleOnDungeonKey)

registerWhen(register("chat", (player, type) => {
    if (player.includes(':')) return
    if (watcherstate > 0) return
    createTitle('&r&a&r&b' + stripRank(player) + '&r&a opened &r&8&lWITHER &r&adoor!&r')
}).setCriteria('${player} opened a WITHER door!'), () => config.titleOnDungeonDoorOpen)