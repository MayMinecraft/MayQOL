/// <reference types="../CTAutocomplete" />
import config from "./config"

import './dungeons/render'
import './dungeons/p3'
import './dungeons/witherKey'
import './dungeons/leap'
import './dungeons/death'
import './dungeons/pearldoor'
import './farming/rotateplayer'
import './mining/getcrystalmaterial'
import './mining/ch'
import './isle/dojo'
import './isle/miniboss'
import './misc/bazaar'
import './misc/gui'
import './misc/debug'
import './misc/search'
import './misc/chat'
import './misc/anvil'
import './utils/utils'

register('command', () => {
    config.openGUI()
}).setName('mayqol').setAliases('mq')