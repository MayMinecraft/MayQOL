/// <reference types="../../CTAutocomplete" />
import { registerWhen } from "../../BloomCore/utils/Utils";
import config from "../config"

registerWhen(register("chat", (missing, event) => {
    if (!config.openMissingSackitem) return
    cancel(event);
    ChatLib.chat(new Message("&r&cYou have no " + missing + " in your Sacks!&r ", new TextComponent("&r&a[Open in bz]&r").setClick("run_command", "/bz " + missing).setHoverValue("Runs /bz " + missing)));
}).setCriteria("You have no ${missing} in your Sacks!"), () => config.openMissingSackitem)

function openItemInBazaar(item) {
    ChatLib.command(`bz ${item}`);
}