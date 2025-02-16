import config from '../config'
import { isInDungeon } from '../utils/utils'
import { registerWhen } from '../../BloomCore/utils/Utils'

registerWhen(register('chat', (name, event) => {
    if (!isInDungeon() || !config.deathMessage) return
    const message = ChatLib.getChatMessage(event)
    if (message.includes('reconnected') || message.includes('Cata Level')) return
    if ((message.includes('You') || message.includes(Player.getName())) && config.ownDeathMessage) return

    let text = config.deathMessageText
    if (text.includes('{name}')) {
        text = text.replace(/{name}/g, name)
    }

    if (text.includes(',')) {
        messagesArray = text.split(',')
        text = messagesArray[Math.floor(Math.random() * messagesArray.length)]
    }
    ChatLib.command(`pc ${text}`)
}).setCriteria(/^ ☠ (\S+) .+/), () => config.deathMessage)