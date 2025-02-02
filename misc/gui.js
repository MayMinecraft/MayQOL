/// <reference types="../../CTAutocomplete" />
import { data } from '../data/data';
import config from "../config";
import { registerWhen } from '../../BloomCore/utils/Utils'

const S37PacketStatistics = Java.type('net.minecraft.network.play.server.S37PacketStatistics')
const C16PacketClientStatus = Java.type('net.minecraft.network.play.client.C16PacketClientStatus')
const S03_PACKET_TIME_UPDATE = Java.type('net.minecraft.network.play.server.S03PacketTimeUpdate')

let prevTime = null
let averageTps = 20
const tpsWindow = 10

const S01PacketJoinGame = Java.type('net.minecraft.network.play.server.S01PacketJoinGame')
const System = Java.type('java.lang.System')

let isPinging = false
let pingCache = -1
let lastPingAt = -1


function sendPing() {
	if (!isPinging) {
		Client.sendPacket(new C16PacketClientStatus(C16PacketClientStatus.EnumState.REQUEST_STATS))
		lastPingAt = System.nanoTime()
		isPinging = true
	}
}

register('step', () => {
	if (config.pingHUD) sendPing()
}).setDelay(2)

register('worldLoad', () => {
	prevTime = null
	averageTps = 20
	pingCache = -1
	isPinging = false
})

registerWhen(register('packetReceived', () => {
	if (lastPingAt > 0) {
		lastPingAt = -1
		isPinging = false
	}
}).setFilteredClass(S01PacketJoinGame), () => config.pingHUD)

registerWhen(register('packetReceived', () => {
	if (lastPingAt > 0) {
		let diff = Math.abs((System.nanoTime() - lastPingAt) / 1_000_000)
		lastPingAt *= -1
		pingCache = diff
		isPinging = false
	}
}).setFilteredClass(S37PacketStatistics), () => config.pingHUD)

registerWhen(register('packetReceived', () => {
	if (prevTime !== null) {
		let time = Date.now() - prevTime
		let instantTps = MathLib.clampFloat(20000 / time, 0, 20)
		let alpha = 2 / (tpsWindow + 1)
		averageTps = instantTps * alpha + averageTps * (1 - alpha)
	}
	prevTime = Date.now()
}).setFilteredClass(S03_PACKET_TIME_UPDATE), () => config.tpsHUD)

registerWhen(register('renderOverlay', () => {
	if (config.pingHUD) {
		Renderer.drawStringWithShadow(
			`PING: §e${parseInt(pingCache)}`,
			data.pingCoords.x,
			data.pingCoords.y
		)
	}
	if (config.tpsHUD) {
		Renderer.drawStringWithShadow(
			`TPS: §e${averageTps.toFixed(1)}`,
			data.tpsCoords.x,
			data.tpsCoords.y
		)

	}

	if (config.fpsHUD) {
		Renderer.drawStringWithShadow(
			`FPS: §e${Client.getFPS()}`,
			data.fpsCoords.x,
			data.fpsCoords.y
		)
	}


}), () => config.pingHUD || config.tpsHUD || config.fpsHUD)

registerWhen(register('renderOverlay', () => {
	if ((config.searchTextGUI.isOpen())) {
		const GuiTextField = Java.type("net.minecraft.client.gui.GuiTextField")
		movingSearchGUI = new GuiTextField(0, Client.getMinecraft().field_71466_p, data.searchCoords.x, data.searchCoords.y, 100, 10);
		movingSearchGUI.func_146194_f();
		Renderer.drawStringWithShadow(
			`Search Item`,
			data.searchCoords.x,
			data.searchCoords.y - 10
		)
	}

	if ((config.pingGui.isOpen() && !config.pingHUD) || config.hudGui.isOpen() && !config.pingHUD) {
		Renderer.drawStringWithShadow(
			`Ping: §e150`,
			data.pingCoords.x,
			data.pingCoords.y
		)
	}

	if ((config.tpsGui.isOpen() && !config.tpsHUD) || config.hudGui.isOpen() && !config.tpsHUD) {
		Renderer.drawStringWithShadow(
			`TPS: §e20.0`,
			data.tpsCoords.x,
			data.tpsCoords.y
		)
	}

	if ((config.fpsGui.isOpen() && !config.fpsHUD) || config.hudGui.isOpen() && !config.fpsHUD) {
		Renderer.drawStringWithShadow(
			`FPS: §e144`,
			data.fpsCoords.x,
			data.fpsCoords.y
		)
	}
}), () => config.searchTextGUI.isOpen() || config.pingGui.isOpen() || config.tpsGui.isOpen() || config.fpsGui.isOpen() || config.hudGui.isOpen())


register('dragged', (dx, dy, x, y) => {
	if (config.searchTextGUI.isOpen()) {
		data.searchCoords.x = x
		data.searchCoords.y = y
		data.save()
	}
	if (config.pingGui.isOpen()) {
		data.pingCoords.x = x
		data.pingCoords.y = y
		data.save()
	}
	if (config.tpsGui.isOpen()) {
		data.tpsCoords.x = x
		data.tpsCoords.y = y
		data.save()
	}

	if (config.fpsGui.isOpen()) {
		data.fpsCoords.x = x
		data.fpsCoords.y = y
		data.save()
	}

	if (config.hudGui.isOpen()) {
		tpsdx = data.tpsCoords.x - data.pingCoords.x
		tpsdy = data.tpsCoords.y - data.pingCoords.y
		fpsdx = data.fpsCoords.x - data.pingCoords.x
		fpsdy = data.fpsCoords.y - data.pingCoords.y
		data.pingCoords.x = x
		data.pingCoords.y = y
		data.tpsCoords.x = tpsdx + x
		data.tpsCoords.y = tpsdy + y
		data.fpsCoords.x = fpsdx + x
		data.fpsCoords.y = fpsdy + y
		data.save()
	}
})
