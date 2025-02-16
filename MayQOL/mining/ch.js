/// <reference types="../../CTAutocomplete" />
import config from "../config"
import { registerWhen } from '../../BloomCore/utils/Utils'
import { getArea } from '../utils/utils';
import RenderLib from '../../RenderLib/index'

registerWhen(register("renderEntity", (entity, pos, partialTicks, event) => {
    if (entity.getName().includes("Automaton")) {
        RenderLib.drawEspBox(entity.getX(), entity.getY() - 3.2, entity.getZ(), 1.5, 3, 0.8, 0.8, 0.8, 1, true)
    }
}), () => config.crystalHollowsAutomatonESP && getArea() == 'Crystal Hollows')

registerWhen(register("renderEntity", (entity, pos, partialTicks, event) => {
    if (entity.getName().includes("Fireslinger") || entity.getName().includes("Creeperlobber") || entity.getName().includes("Pitfighter") || entity.getName().includes("Knifethrower") || entity.getName().includes("Goblin Flamethrower") || entity.getName().includes("Murderlover") || entity.getName().includes("Weakling")) {
        RenderLib.drawEspBox(entity.getX(), entity.getY() - 2, entity.getZ(), 1, 2, 1, 1, 1, 1, true)
    }
}), () => config.crystalHollowsGoblinESP && getArea() == 'Crystal Hollows')

registerWhen(register("renderEntity", (entity, pos, partialTicks, event) => {
    if (entity.getName().includes("Grunt") || entity.getName().includes("Sebastian") || entity.getName().includes("Wendy") || entity.getName().includes("Viper") || entity.getName().includes("Corleone")) {
        RenderLib.drawEspBox(entity.getX(), entity.getY() - 2, entity.getZ(), 1, 2, 1, 1, 1, 1, true)
    }
}), () => config.crystalHollowsYogESP && getArea() == 'Crystal Hollows')

registerWhen(register("renderEntity", (entity, pos, partialTicks, event) => {
    if (entity.getName().includes("Yog")) {
        RenderLib.drawEspBox(entity.getX(), entity.getY() - 1.9, entity.getZ(), 1.3, 1.3, 1, 0, 0, 1, true)
    }
}), () => config.crystalHollowsTeamTreasuriteESP && getArea() == 'Crystal Hollows')

registerWhen(register("renderEntity", (entity, pos, partialTicks, event) => {
    if (entity.getName().includes("Sludge")) {
        if (entity.getName().includes("Lv5")) {
            RenderLib.drawEspBox(entity.getX(), entity.getY() - 0.8, entity.getZ(), 0.5, 0.5, 0, 1, 0, 1, true)
        }
        if (entity.getName().includes("Lv10")) {
            RenderLib.drawEspBox(entity.getX(), entity.getY() - 1.5, entity.getZ(), 1, 1, 0, 1, 0, 1, true)
        }
        if (entity.getName().includes("Lv100")) {
            RenderLib.drawEspBox(entity.getX(), entity.getY() - 2, entity.getZ(), 1.5, 1.5, 0, 1, 0, 1, true)
        }
    }
}), () => config.crystalHollowsSludgeESP && getArea() == 'Crystal Hollows')


registerWhen(register("chat", (event) => {
    if (!config.enterthecrystalhollows) return
    cancel(event);
    ChatLib.chat(new Message("&e[NPC] &5Gwendolyn&f: &rGood luck in the mines!&r ", new TextComponent("&r&a[Enter]&r").setClick("run_command", "/enterthecrystalhollows").setHoverValue("Runs /enterthecrystalhollows")));
}).setCriteria("[NPC] Gwendolyn: Good luck in the mines!"), () => config.enterthecrystalhollows);

registerWhen(register("chat", (event) => {
    if (!config.addAmethystCheeseWaypoint) return
    cancel(event);
    ChatLib.chat(new Message("&e[NPC] &bKalhuiki Door Guardian&f: &rThe door is open, go in!&r ", new TextComponent("&r&a[add Cheese Waypoint]&r").setClick("run_command", "/sthw set " + Math.round(Player.getX() + 61) + " " + Math.round(Player.getY() - 44) + " " + Math.round(Player.getZ() + 18) + " Jungle Cheese").setHoverValue("Runs &r&a/sthw set " + Math.round(Player.getX() + 61) + " " + Math.round(Player.getY() - 44) + " " + Math.round(Player.getZ() + 18) + " Jungle Cheese&r")));
}).setCriteria("[NPC] Kalhuiki Door Guardian: The door is open, go in!"), () => config.addAmethystCheeseWaypoint);

registerWhen(register("chat", (event) => {
    if (!config.addAmethystCheeseWaypoint) return
    cancel(event);
    ChatLib.chat(new Message("&e[NPC] &bKalhuiki Door Guardian&f: &rThis temple does not have the treasure you are seeking at this time (Crystal already obtained).&r ", new TextComponent("&r&a[add Cheese Waypoint]&r").setClick("run_command", "/sthw set " + Math.round(Player.getX() + 61) + " " + Math.round(Player.getY() - 44) + " " + Math.round(Player.getZ() + 18) + " Jungle Cheese").setHoverValue("Runs &r&a/sthw set " + Math.round(Player.getX() + 61) + " " + Math.round(Player.getY() - 44) + " " + Math.round(Player.getZ() + 18) + " Jungle Cheese&r")));
}).setCriteria("[NPC] Kalhuiki Door Guardian: This temple does not have the treasure you are seeking at this time."), () => config.addAmethystCheeseWaypoint);