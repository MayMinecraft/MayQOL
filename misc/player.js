/// <reference types="../../CTAutocomplete" />
const MCBlock = Java.type("net.minecraft.block.Block");


register("command", (x, y, z) => {
    setghostblock(x, y, z);
}).setName("setghostblock");

function setBlockAt(x, y, z, id) {
	const world = World.getWorld();
	const blockPos = getBlockPosFloor(x, y, z).toMCBlock();
	world.func_175656_a(blockPos, MCBlock.func_176220_d(id));
	world.func_175689_h(blockPos);
}

function getBlockPosFloor(x, y, z) {
	return new BlockPos(Math.floor(x), Math.floor(y), Math.floor(z));
}

function setghostblock(x, y, z) {
    setBlockAt(x, y, z, 0)
}