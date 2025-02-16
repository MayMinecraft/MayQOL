/// <reference types="../../CTAutocomplete" />


register("command", (yaw, pitch) => {
    handleRotatePlayer(yaw, pitch);
}).setName("setyaw");

function handleRotatePlayer(yaw, pitch) {
    yaw = parseFloat(yaw);

    if (!pitch) {
        rotate(yaw);
    } else {
        pitch = parseFloat(pitch);
        rotate(yaw, pitch);
    }
}

function rotate(yaw, pitch = Player.getPlayer().field_70125_A) {
    const player = Player.getPlayer();
    player.field_70177_z = yaw;
    player.field_70125_A = pitch;
    ChatLib.chat(`Rotating player to Yaw: ${yaw}, Pitch: ${pitch}`);
}