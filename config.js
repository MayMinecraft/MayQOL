import {
    @ButtonProperty,
    @CheckboxProperty,
    Color,
    @ColorProperty,
    @PercentSliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @Vigilant,
    @SliderProperty
} from '../Vigilance/index';

@Vigilant('MayQOL', '§zMayQOL', {
    getCategoryComparator: () => (a, b) => {
        const categories = ['General', 'Dungeon', 'Mining', 'Farming', 'Crimson Isle', 'Misc', 'HUD', 'Debug'];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})

class Config {

    searchTextGUI = new Gui();
    pingGui = new Gui();
    fpsGui = new Gui();
    tpsGui = new Gui();
    hudGui = new Gui();

    // --- General ---
    @SwitchProperty({
        name: 'Rank Emotes',
        description: 'Replaces all MVP++ Emotes and Emotes available through Rank Gifting with the Emote in send messages.',
        category: 'General',
        subcategory: 'Emotes'
    })
    chatReplaceRankEmotes = false;

    @SwitchProperty({
        name: 'Party Commands',
        description: 'Use !help for all commands.',
        category: 'General',
        subcategory: 'Party Commands'
    })
    chatPartyCommands = false;

    @SwitchProperty({
        name: 'Party Command Feedback',
        description: 'Send executed command in party chat',
        category: 'General',
        subcategory: 'Party Commands'
    })
    chatPartyCommandFeedback = false;

    // --- Dungeon ---
    @SwitchProperty({
        name: 'Auto Requeue',
        description: 'Automatically requeues at the end of dungeon run',
        category: 'Dungeon',
        subcategory: 'General'
    })
    autoRequeue = false;

    @SelectorProperty({
        name: 'Auto Requeue Mode',
        category: 'Dungeon',
        subcategory: 'General',
        options: ['/requeue', '/join floor', '!f in chat'],
    })
    autoRequeueMode = 0;

    @SliderProperty({
        name: 'Auto Requeue Delay',
        description: 'Delay in seconds',
        category: 'Dungeon',
        subcategory: 'General',
        min: 0,
        max: 30,
        step: 1,
    })
    autoRequeueDelay = 0;

    @SwitchProperty({
        name: 'Title Announce Watcher',
        description: 'Displays a title when watcher is ready for blood camp, all mobs are spawned and all mobs are killed.',
        category: 'Dungeon',
        subcategory: 'Blood Rush'
    })
    announceWatcherStatusTitle = false;

    @SwitchProperty({
        name: 'Chat Announce Watcher',
        description: 'Sends chat messages when watcher is ready for blood camp, all mobs are spawned and all mobs are killed.',
        category: 'Dungeon',
        subcategory: 'Blood Rush'
    })
    announceWatcherStatusChat = false;

    @SwitchProperty({
        name: 'Title Announce Key',
        description: 'Displays a title when a Key was picked up!',
        category: 'Dungeon',
        subcategory: 'Blood Rush'
    })
    titleOnDungeonKey = false;

    @SwitchProperty({
        name: 'Title Announce Door Open',
        description: 'Displays a title when a Door is opened!',
        category: 'Dungeon',
        subcategory: 'Blood Rush'
    })
    titleOnDungeonDoorOpen = false;

    @SwitchProperty({
        name: 'Key ESP',
        description: 'Highlights Wither and Blood Keys with a ESP.',
        category: 'Dungeon',
        subcategory: 'Blood Rush'
    })
    highlightKeys = false

    @SwitchProperty({
        name: 'Pearl Door',
        description: 'Hold an ender pearl and run against a wither or blood door to ghost through.',
        category: 'Dungeon',
        subcategory: 'Blood Rush'
    })
    pearlDoor = false

    @SwitchProperty({
        name: 'Announce Melody',
        description: 'Sends a message in Party Chat if you get the Melody Terminal',
        category: 'Dungeon',
        subcategory: 'Terminals'
    })
    announceMelody = false

    @SwitchProperty({
        name: 'Announce Melody Progress',
        description: 'Sends a message in Party Chat with the progress of your terminal',
        category: 'Dungeon',
        subcategory: 'Terminals'
    })
    melodyProgress = false

    @TextProperty({
        name: "Announce Melody Text",
        description: "Text used for Announce Melody",
        category: "Dungeon",
        subcategory: "Terminals",
        placeholder: "Melody"
    })
    melodyText = "melody";

    @SelectorProperty({
        name: 'Highlight in Leap Menu',
        description: 'The class to highlight in the spirit leap menu.',
        category: 'Dungeon',
        subcategory: 'General',
        options: ['None', 'Archer', 'Mage', 'Bers', 'Tank', 'Healer'],
    })
    leapHighlight = 0;

    @SelectorProperty({
        name: 'Auto Leap Boss',
        description: 'Leaps to the selected player in boss fight when hitting with leap',
        category: 'Dungeon',
        subcategory: 'General',
        options: ['None', 'Archer', 'Mage', 'Bers', 'Tank', 'Healer', 'Door Opener'],
    })
    autoLeapToPlayerInBoss = 0;

    @SelectorProperty({
        name: 'Auto Leap Clear',
        description: 'Leaps to the selected player while clearing when hitting with leap',
        category: 'Dungeon',
        subcategory: 'General',
        options: ['None', 'Archer', 'Mage', 'Bers', 'Tank', 'Healer', 'Door Opener'],
    })
    autoLeapToPlayerInClear = 0;

    @ColorProperty({
        name: 'Highlight Color',
        description: 'Changes the color of the highlight',
        category: 'Dungeon',
        subcategory: 'General',
    })
    leapColor = new java.awt.Color(255 / 255, 30 / 255, 30 / 255);

    @SwitchProperty({
        name: 'Death Hater',
        description: 'Sends a message everytime someone dies in Dungeons.',
        category: 'Dungeon',
        subcategory: 'General'
    })
    deathMessage = false

    @SwitchProperty({
        name: 'Exclude Own Death',
        description: 'Wont send hate if u die (Its hate enought to die with this enabled)',
        category: 'Dungeon',
        subcategory: 'General'
    })
    ownDeathMessage = false

    @TextProperty({
        name: "Death Message Text",
        description: "The text sent on dungeon death.\nUse {name} to use the dead player's name.\nUse a comma to use many messages. Random choosen",
        category: "Dungeon",
        subcategory: "General",
        placeholder: "BOOM!"
    })
    deathMessageText = "BOOM!";

    // --- Mining ---
    @SwitchProperty({
        name: 'Fast /enterthecrystalhollows',
        description: 'Enable to run /enterthecrystalhollows when entering minecard to Crystal hollows',
        category: 'Mining',
        subcategory: 'Crystal Hollows'
    })
    enterthecrystalhollows = false;

    @SwitchProperty({
        name: 'Jungle Temple Cheese',
        description: 'Add a skytils waypoint to cheese Jungle Temple\nGo into corner behind the left Kalhuiki Door Guardian BEFORE talking to him! Coordiantes are relative to player coordinates.',
        category: 'Mining',
        subcategory: 'Crystal Nucleus Runs'
    })
    addAmethystCheeseWaypoint = false;

    @SwitchProperty({
        name: 'Auto Crystal Material Sapphire',
        description: 'Moves missing parts for Sapphire Crystal into your Inventory (from Sack), when talking to Professor Robot.',
        category: 'Mining',
        subcategory: 'Crystal Nucleus Runs'
    })
    autocrystalmaterialsapphire = false;

    @SwitchProperty({
        name: 'Auto Crystal Material Amber',
        description: 'Moves 1 Goblin Egg into your Inventory (from Sack), when talking to King Yolkar.',
        category: 'Mining',
        subcategory: 'Crystal Nucleus Runs'
    })
    autocrystalmaterialamber = false;

    @SliderProperty({
        name: 'Goblin Egg Amount',
        description: 'How many Goblin Eggs are needed for Yolkar?',
        category: 'Mining',
        subcategory: 'Crystal Nucleus Runs',
        min: 1,
        max: 3,
        step: 1,
    })
    kingYolkarGoblinEggsRequired = 1;

    @SwitchProperty({
        name: 'Auto Crystal Material Amethyst',
        description: 'Moves 1 Jungle Key into your Inventory (from Sack), when talking to Kalhuiki Door Guardian.',
        category: 'Mining',
        subcategory: 'Crystal Nucleus Runs'
    })
    autocrystalmaterialamethyst = false;

    // --- Crimson Isle ---

    @SwitchProperty({
        name: 'Auto Discipline',
        description: 'Automatically switches to the right sword when playing dicipline.',
        category: 'Crimson Isle',
        subcategory: 'Dojo'
    })
    dojoHelperAutoDicipline = false;

    @SwitchProperty({
        name: 'Crimson Isle Miniboos Esp',
        description: 'ESP LOL NOTHING TO EXPLAIN',
        category: 'Crimson Isle',
        subcategory: 'Miniboss'
    })
    crimsonIsleMiniBossESP = false;

    // --- Misc ---
    @SwitchProperty({
        name: 'Empty Sack Bazaar Search',
        description: 'Adds a button next to "You have no {missing} in your Sacks!", that opens the Item in Bazaar when clicked.',
        category: 'Misc',
        subcategory: 'Bazaar'
    })
    openMissingSackitem = false;

    @SwitchProperty({
        name: 'Search Bar',
        description: 'Adds a search bar to most GUI',
        category: 'Misc',
        subcategory: 'Search'
    })
    inventorySearch = false;

    @SwitchProperty({
        name: 'Search Bar Accuracy',
        description: 'By default the search term must match Title. Enable this, to highlight items that include the search term. Required for NBT Data Search.',
        category: 'Misc',
        subcategory: 'Search'
    })
    inventorySearchIncludePhrase = false;

    @SwitchProperty({
        name: 'NBT Data',
        description: 'Will the Search Bar include NBT Data?',
        category: 'Misc',
        subcategory: 'Search'
    })
    inventorySearchNBTData = false;

    @ButtonProperty({
        name: 'Move Search Bar',
        description: 'Moves the search bar',
        category: 'Misc',
        subcategory: 'Search',
        placeholder: 'Move'
    })
    MoveSearchBarGui() {
        this.searchTextGUI.open();
    }

    @SwitchProperty({
        name: 'Auto Item to Inventory',
        description: 'Moves Items matching a querry into your inventory when pressing key',
        category: 'Misc',
        subcategory: 'Search'
    })
    inventorySearchMoveMatchingItems = false;

    @SwitchProperty({
        name: 'Auto Anvil Book Combine',
        description: 'Automatically combines enchanted books while being in an anvil gui.',
        category: 'Misc',
        subcategory: 'Anvil'
    })
    autoAnvilBookCombine = false;

    // --- HUD ---

    @ColorProperty({
        name: 'HUD Color',
        description: 'Changes the color of all HUD elements',
        category: 'HUD',
        subcategory: 'HUD',
    })
    hudColor = new java.awt.Color(255 / 255, 19 / 255, 240 / 255);

    @SwitchProperty({
        name: 'Ping Display',
        description: 'Display for your Ping',
        category: 'HUD',
        subcategory: 'HUD'
    })
    pingHUD = false;

    @ButtonProperty({
        name: 'Move Ping',
        description: 'Moves the Ping Display',
        category: 'HUD',
        subcategory: 'Move HUD',
        placeholder: 'Move'
    })
    MovePingGui() {
        this.pingGui.open();
    }

    @SwitchProperty({
        name: 'TPS Display',
        description: 'Displays the server\'s TPS',
        category: 'HUD',
        subcategory: 'HUD'
    })
    tpsHUD = false;

    @ButtonProperty({
        name: "Move TPS",
        description: "Moves the TPS Display",
        category: "HUD",
        subcategory: "Move HUD",
        placeholder: "Move"
    })
    MoveTPSGui() {
        this.tpsGui.open();
    }

    @SwitchProperty({
        name: 'FPS Display',
        description: 'Display for your FPS',
        category: 'HUD',
        subcategory: 'HUD'
    })
    fpsHUD = false;

    @ButtonProperty({
        name: "Move FPS",
        description: "Moves the FPS Display",
        category: "HUD",
        subcategory: "Move HUD",
        placeholder: "Move"
    })
    MoveFPSGui() {
        this.fpsGui.open();
    }

    @ButtonProperty({
        name: "Block move HUD",
        description: "Moves Ping, TPS, and FPS in a block.",
        category: "HUD",
        subcategory: "Move HUD",
        placeholder: "Move"
    })
    MoveHUDGui() {
        this.hudGui.open();
    }

    // --- Debug ---
    @SwitchProperty({
        name: 'Debug Area On Join',
        description: 'Sends the current Area into chat on world load',
        category: 'Debug',
        subcategory: 'Area'
    })
    debugAreaOnJoin = false;

    @SwitchProperty({
        name: 'Debug Sponge Test',
        description: 'Testing usin a frickn Sponge :D',
        category: 'Debug',
        subcategory: 'Inventory'
    })
    debugSpongeTest = false;

    constructor() {
        this.initialize(this);
        this.addDependency("Party Command Feedback", "Party Commands")
        this.addDependency("Auto Requeue Mode", "Auto Requeue")
        this.addDependency("Auto Requeue Delay", "Auto Requeue")
        this.addDependency("Move Search Bar", "Search Bar")
        this.addDependency("Auto Item to Inventory", "Search Bar")
        this.addDependency("Search Bar Accuracy", "Search Bar")
        this.addDependency("NBT Data", "Search Bar Accuracy")
        this.addDependency("Announce Melody Progress", "Announce Melody")
        this.addDependency("Announce Melody Text", "Announce Melody")
        this.addDependency("Exclude Own Death", "Death Hater")
        this.addDependency("Death Message Text", "Death Hater")
    }

}

export default new Config();
