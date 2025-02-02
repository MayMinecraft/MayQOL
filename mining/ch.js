/// <reference types="../../CTAutocomplete" />
import config from "../config"
import { registerWhen } from '../../BloomCore/utils/Utils'

registerWhen(register("chat", (event) => {
    if(!config.enterthecrystalhollows) return
    cancel(event);
   ChatLib.chat(new Message("&e[NPC] &5Gwendolyn&f: &rGood luck in the mines!&r ", new TextComponent("&r&a[Enter]&r").setClick("run_command", "/enterthecrystalhollows").setHoverValue("Runs /enterthecrystalhollows")));
}).setCriteria("[NPC] Gwendolyn: Good luck in the mines!"), () => config.enterthecrystalhollows);

registerWhen(register("chat", (event) => {
    if(!config.addAmethystCheeseWaypoint) return
    cancel(event);
   ChatLib.chat(new Message("&e[NPC] &bKalhuiki Door Guardian&f: &rThe door is open, go in!&r ", new TextComponent("&r&a[add Cheese Waypoint]&r").setClick("run_command", "/sthw set " + Math.round(Player.getX()+61) + " " + Math.round(Player.getY()-44) + " " + Math.round(Player.getZ()+18) + " Jungle Cheese").setHoverValue("Runs &r&a/sthw set " + Math.round(Player.getX()+61) + " " + Math.round(Player.getY()-44) + " " + Math.round(Player.getZ()+18) + " Jungle Cheese&r")));
}).setCriteria("[NPC] Kalhuiki Door Guardian: The door is open, go in!"), () => config.addAmethystCheeseWaypoint);

registerWhen(register("chat", (event) => {
    if(!config.addAmethystCheeseWaypoint) return
    cancel(event);
   ChatLib.chat(new Message("&e[NPC] &bKalhuiki Door Guardian&f: &rThis temple does not have the treasure you are seeking at this time (Crystal already obtained).&r ", new TextComponent("&r&a[add Cheese Waypoint]&r").setClick("run_command", "/sthw set " + Math.round(Player.getX()+61) + " " + Math.round(Player.getY()-44) + " " + Math.round(Player.getZ()+18) + " Jungle Cheese").setHoverValue("Runs &r&a/sthw set " + Math.round(Player.getX()+61) + " " + Math.round(Player.getY()-44) + " " + Math.round(Player.getZ()+18) + " Jungle Cheese&r")));
}).setCriteria("[NPC] Kalhuiki Door Guardian: This temple does not have the treasure you are seeking at this time."), () => config.addAmethystCheeseWaypoint);