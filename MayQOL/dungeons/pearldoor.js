/// <reference types="../../CTAutocomplete" />
import config from "../config"
import { registerWhen } from "../../BloomCore/utils/Utils";
import Dungeon from "../../BloomCore/dungeons/Dungeon";

const MCBlock = Java.type("net.minecraft.block.Block");
const C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer");
const C08PacketPlayerBlockPlacement = Java.type("net.minecraft.network.play.client.C08PacketPlayerBlockPlacement");
const S08PacketPlayerPosLook = Java.type("net.minecraft.network.play.server.S08PacketPlayerPosLook");

const validBlocks = [173, 159];

let inDoor = false;

registerWhen(register("packetSent", (packet, event) => {
	if (!Dungeon.inDungeon) return;
	if (inDoor) return;
	const item = Player.getHeldItem();
	if (item?.getID() !== 368) return;
	const moving = packet.func_149466_j();
	const rotating = packet.func_149463_k();
	const onGround = packet.func_149465_i();
	if (!moving) return;
	const [x, y, z] = [packet.func_149464_c(), packet.func_149467_d(), packet.func_149472_e()];
	if (y !== 69 || x > 0 || z > 0 || x < -200 || z < -200) return;
	let yaw = null;
	let pitch = null;
	let xOffset = 0;
	let zOffset = 0;
	if (validBlocks.includes(getBlockFloor(x, y, z + 0.301).type.getID())) {
		yaw = 0;
		pitch = -90;
		zOffset = 1;
	} else if (validBlocks.includes(getBlockFloor(x - 0.301, y, z).type.getID())) {
		yaw = 90;
		pitch = -90;
		xOffset = -1;
	} else if (validBlocks.includes(getBlockFloor(x, y, z - 0.301).type.getID())) {
		yaw = 180;
		pitch = -90;
		zOffset = -1;
	} else if (validBlocks.includes(getBlockFloor(x + 0.301, y, z).type.getID())) {
		yaw = 270;
		pitch = -90;
		xOffset = 1;
	}
	if (yaw === null || pitch === null) return;
	inDoor = true;
	const [initialYaw, initialPitch] = [Player.getYaw(), Player.getPitch()];
	Client.sendPacket(new C03PacketPlayer.C06PacketPlayerPosLook(x, y, z, yaw, pitch, onGround));
	Client.sendPacket(new C08PacketPlayerBlockPlacement(item.itemStack));
	const trigger2 = register("packetReceived", packet => {
		Client.scheduleTask(0, () => rotate(initialYaw, initialPitch));
		const [x, y, z] = [packet.func_148932_c(), packet.func_148928_d(), packet.func_148933_e()];
		// block logic
		setBlockAt(x + xOffset, y, z + zOffset, 0);
		setBlockAt(x + xOffset * 2, y, z + zOffset * 2, 0);
		setBlockAt(x + xOffset * 3, y, z + zOffset * 3, 0);
		setBlockAt(x + xOffset * 4, y, z + zOffset * 4, 0);
		setBlockAt(x + xOffset, y + 1, z + zOffset, 0);
		setBlockAt(x + xOffset * 2, y + 1, z + zOffset * 2, 0);
		setBlockAt(x + xOffset * 3, y + 1, z + zOffset * 3, 0);
		setBlockAt(x + xOffset * 4, y + 1, z + zOffset * 4, 0);
		inDoor = false;
		trigger2.unregister();
	}).setFilteredClass(S08PacketPlayerPosLook);
	cancel(event);
}).setFilteredClass(C03PacketPlayer), () => config.pearlDoor && Dungeon.inDungeon)

function setBlockAt(x, y, z, id) {
	const world = World.getWorld();
	const blockPos = getBlockPosFloor(x, y, z).toMCBlock();
	world.func_175656_a(blockPos, MCBlock.func_176220_d(id));
	world.func_175689_h(blockPos);
}

function isWithinTolerence(n1, n2) {
	return Math.abs(n1 - n2) < 1e-4;
}

function getBlockPosFloor(x, y, z) {
	return new BlockPos(Math.floor(x), Math.floor(y), Math.floor(z));
}

function getBlockFloor(x, y, z) {
	return World.getBlockAt(Math.floor(x), Math.floor(y), Math.floor(z));
}

function rotate(yaw, pitch) {
	const player = Player.getPlayer();
	player.field_70177_z = yaw;
	player.field_70125_A = pitch;
}
