document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('itemsContainer');
    const combineButton = document.getElementById('combineButton');
    const resultArea = document.getElementById('resultArea');
    const resultModal = document.getElementById('resultModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeModal = document.getElementById('closeModal');

    let selectedItems = [];
    let userScore = getCookie('userScore') ? parseInt(getCookie('userScore')) : 0;
    let craftedItems = getCookie('craftedItems') ? JSON.parse(getCookie('craftedItems')) : [];

    function addItemClickEvent(item) {
        item.addEventListener('click', () => {
            if (selectedItems.includes(item)) {
                item.classList.remove('selected');
                selectedItems = selectedItems.filter(i => i !== item);
            } else if (selectedItems.length < 2) {
                item.classList.add('selected');
                selectedItems.push(item);
            }
        });
    }

    // Initialize item click events
    document.querySelectorAll('.item').forEach(addItemClickEvent);

    combineButton.addEventListener('click', () => {
        if (selectedItems.length === 1) {
            modalMessage.textContent = "Select another item to combine with.";
            showModal();
        } else if (selectedItems.length === 2) {
            const result = checkCombination(selectedItems[0].dataset.item, selectedItems[1].dataset.item);
            if (result) {
                modalMessage.textContent = `Result of combination: ${result}`;
                addNewItem(result);
                updateScore();
            } else {
                modalMessage.textContent = "No valid combination exists.";
            }
            showModal();
            selectedItems.forEach(i => i.classList.remove('selected'));
            selectedItems = [];
        } else {
            modalMessage.textContent = "Please select an item first!";
            showModal();
        }
    });

    function checkCombination(item1, item2) {
        return combinations[item1 + item2] || combinations[item2 + item1];
    }

    function addNewItem(result) {
        const newItemName = result.split(" ")[0]; // Get just the name part
        const existingItem = Array.from(document.querySelectorAll('.item')).find(item => item.dataset.item === newItemName);

        // Only add the new item if it doesn't already exist
        if (!existingItem && !craftedItems.includes(newItemName)) {
            craftedItems.push(newItemName);
            setCookie('craftedItems', JSON.stringify(craftedItems), 365);

            const newItem = document.createElement('button');
            newItem.className = 'item';
            newItem.dataset.item = newItemName; // Use just the name for future combinations
            newItem.textContent = result; // Display the full result with emoji
            itemsContainer.appendChild(newItem);
            addItemClickEvent(newItem); // Add click event to the new item
        }
    }

    function updateScore() {
        userScore++;
        setCookie('userScore', userScore, 365);
    }

    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${d.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    }

    function getCookie(name) {
        const cname = `${name}=`;
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
        }
        return "";
    }

    function showModal() {
        resultModal.style.display = 'block';
    }

    closeModal.onclick = function () {
        resultModal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target === resultModal) {
            resultModal.style.display = 'none';
        }
    }

   // Combinations list moved to the bottom for easy modification
   const combinations = {
    "WaterWind": "Storm 🌩️",
    "FireRock": "Lava 🌋",
    "WindFire": "Heat 🔥",
    "RockWater": "Mud 💧",
    "WaterEarth": "Swamp 🐊",
    "FireIce": "Steam 💨",
    "LightningWind": "Thunderstorm ⚡",
    "EarthRock": "Mountain ⛰️",
    "IceWater": "Slush ❄️",
    "WaterFire": "Steam 💨",
    "IceFire": "Steam 💨",
    "WaterIce": "Frozen Water ❄️",
    "WindLightning": "Hurricane 🌪️",
    "EarthWater": "Mud 💧",
    "EarthFire": "Magma 🌋",
    "FireLightning": "Electric Fire 🔥⚡",
    "IceWind": "Snowstorm ❄️🌬️",
    "WaterLightning": "Electrified Water ⚡💧",
    "FireWind": "Wildfire 🔥🌬️",
    "EarthWind": "Dust Storm 🌪️🏜️",
    "RockLightning": "Shattered Rock ⚡🪨",
    "IceEarth": "Permafrost 🥶🌍",
    "FireEarth": "Volcano 🌋",
    "WaterRock": "Erosion 🌊🪨",
    "WindIce": "Frost 🌬️❄️",
    "LightningIce": "Cracked Ice ⚡🧊",
    "EarthLightning": "Fulgurite ⚡🏜️",
    "RockIce": "Glacier ❄️🏔️",
    "WindRock": "Sand 🏖️",
    "FireWater": "Geyser 🌋💧",
    "MetalWater": "Rust 🦀",
    "MetalFire": "Molten Metal 🔥🔧",
    "MetalEarth": "Ore 💎",
    "MetalWind": "Wind Chimes 🎐",
    "MetalIce": "Frozen Metal ❄️🔧",
    "MetalLightning": "Conductor ⚡🔧",
    "MetalRock": "Alloy 🔩",
    "WoodWater": "Swamp Tree 🌳💧",
    "WoodFire": "Bonfire 🔥🌳",
    "WoodEarth": "Forest 🌲🌳",
    "WoodWind": "Rustling Leaves 🍃",
    "WoodIce": "Frozen Tree ❄️🌳",
    "WoodLightning": "Burning Tree 🌳⚡",
    "WoodRock": "Petrified Wood 🪵",
    "WoodMetal": "Axe 🪓",
    "LightWater": "Rainbow 🌈",
    "LightFire": "Radiance 🌟",
    "LightEarth": "Dawn 🌅",
    "LightWind": "Shimmering Air ✨💨",
    "LightIce": "Glare 😎",
    "LightLightning": "Flash ⚡💡",
    "LightRock": "Glittering Gems 💎✨",
    "LightMetal": "Reflection 🪞",
    "LightWood": "Sunbeam through Trees 🌳☀️",
    "DarkWater": "Abyss 🌊🌑",
    "DarkFire": "Shadow Flame 🔥🌑",
    "DarkEarth": "Cave 🕳️",
    "DarkWind": "Night Breeze 🌙💨",
    "DarkIce": "Black Ice 🖤❄️",
    "DarkLightning": "Dark Energy ⚡🌑",
    "DarkRock": "Obsidian 🌑🪨",
    "DarkMetal": "Blacksmith's Anvil 🔨🌑",
    "DarkWood": "Haunted Forest 👻🌳",
    "DarkLight": "Eclipse 🌘",
    "LifeWater": "Plankton 🦠🌊",
    "LifeFire": "Phoenix 🔥🐦",
    "LifeEarth": "Ecosystem 🌍",
    "LifeWind": "Spores 🍄💨",
    "LifeIce": "Tardigrade 🐻‍❄️",
    "LifeLightning": "Vitality ⚡💪",
    "LifeRock": "Coral 🪸",
    "LifeMetal": "Cyborg 🤖",
    "LifeWood": "Dryad 🧚‍♀️🌳",
    "LifeLight": "Photosynthesis ☀️🌿",
    "LifeDark": "Nocturnal Creatures 🦉🌙",
    "DeathWater": "Shipwreck 🚢💀",
    "DeathFire": "Ash ⚱️",
    "DeathEarth": "Fossil ☠️",
    "DeathWind": "Banshee 👻💨",
    "DeathIce": "Extinction ❄️☠️",
    "DeathLightning": "Execution ⚡💀",
    "DeathRock": "Gravestone 🪦",
    "DeathMetal": "Rust 🦀",
    "DeathWood": "Deadwood 🪵💀",
    "DeathLight": "Will-o'-the-Wisp 🧞",
    "DeathDark": "The Void 🕳️",
    "DeathLife": "Zombie 🧟",
    "TimeWater": "River 🏞️",
    "TimeFire": "Eternal Flame 🕯️",
    "TimeEarth": "Mountain Formation 🏔️",
    "TimeWind": "Erosion 🌬️🏜️",
    "TimeIce": "Glacier ❄️🏔️",
    "TimeLightning": "Instant ⚡",
    "TimeRock": "Geode 🪨💎",
    "TimeMetal": "Rust 🦀",
    "TimeWood": "Tree Rings 🌳",
    "TimeLight": "Day Cycle ☀️🌙",
    "TimeDark": "Night 🌃",
    "TimeLife": "Evolution 🐒➡️🧑",
    "TimeDeath": "Decay ☠️",
    "SpaceWater": "Nebula 🌌💧",
    "SpaceFire": "Star ⭐",
    "SpaceEarth": "Planet 🌍",
    "SpaceWind": "Solar Wind 🌞💨",
    "SpaceIce": "Comet ☄️",
    "SpaceLightning": "Pulsar ⚡🌌",
    "SpaceRock": "Asteroid 🪨☄️",
    "SpaceMetal": "Satellite 🛰️",
    "SpaceWood": "Cosmic Tree 🌳🌌",
    "SpaceLight": "Starlight ✨",
    "SpaceDark": "Black Hole 🕳️",
    "SpaceLife": "Alien 👽",
    "SpaceDeath": "Supernova 💥",
    "SpaceTime": "Spacetime Continuum 🌌⏳",
    "SoundWater": "Wave 🌊🔊",
    "SoundFire": "Crackle 🔥🔊",
    "SoundEarth": "Earthquake 🌍🔊",
    "SoundWind": "Whistle 🌬️🎵",
    "SoundIce": "Cracking 🧊🔊",
    "SoundLightning": "Thunder ⚡🔊",
    "SoundRock": "Rockfall 🪨🔊",
    "SoundMetal": "Bell 🔔",
    "SoundWood": "Drum 🥁",
    "SoundLight": "Buzzing 💡🔊",
    "SoundDark": "Silence 🤫",
    "SoundLife": "Heartbeat 💓",
    "SoundDeath": "Last Breath 😮💨",
    "SoundTime": "Tick Tock ⏰",
    "SoundSpace": "Cosmic Hum 🌌🔊",
    "GravityWater": "Whirlpool 🌀",
    "GravityFire": "Floating Flame 🔥☁️",
    "GravityEarth": "Landslide 🏔️🪨",
    "GravityWind": "Density Currents 🌬️🏔️",
    "GravityIce": "Icicle 🧊",
    "GravityLightning": "Lightning Rod ⚡🏔️",
    "GravityRock": "Avalanche 🏔️🪨",
    "GravityMetal": "Magnetic Field 🧲",
    "GravityWood": "Falling Tree 🌳💨",
    "GravityLight": "Black Hole 🕳️",
    "GravityDark": "Dark Matter 🌌🕳️",
    "GravityLife": "Growth 🌱⬆️",
    "GravityDeath": "Sinkhole 🕳️☠️",
    "GravityTime": "Time Dilation ⏳🕰️",
    "GravitySpace": "Orbit 🛰️🌍",
    "GravitySound": "Infrasound 🔊〰️",
    "WaterMetal": "Oxidation 🦀💧",
    "FireMetal": "Blacksmith's Forge 🔥🔨",
    "EarthMetal": "Mining ⛏️🪨",
    "WindMetal": "Windmill 🌬️⚙️",
    "IceMetal": "Frost Patterns ❄️🔧",
    "LightningMetal": "Tesla Coil ⚡🔧",
    "RockMetal": "Ore Vein 🪨💎",
    "WoodMetal": "Lumber Mill 🪵🔨",
    "LightMetal": "Polished Surface ✨🔧",
    "DarkMetal": "Shadow Steel 🌑🔧",
    "LifeMetal": "Bionics 🦾",
    "DeathMetal": "Rust 🦀☠️",
    "TimeMetal": "Clock ⏰",
    "SpaceMetal": "Spacecraft 🚀",
    "SoundMetal": "Gong 🔔",
    "GravityMetal": "Pendulum 🏔️🔧",
    "WaterWood": "Driftwood 🌊🪵",
    "FireWood": "Charcoal 🔥🪵",
    "EarthWood": "Root System 🌳🌍",
    "WindWood": "Windbreak 🌬️🌳",
    "IceWood": "Frost-Cracked Bark ❄️🌳",
    "LightningWood": "Charred Tree ⚡🌳",
    "RockWood": "Petrified Forest 🪨🌳",
    "LightWood": "Sunlit Forest ☀️🌳",
    "DarkWood": "Dense Thicket 🌑🌳",
    "LifeWood": "Living Tree 🌳💚",
    "DeathWood": "Deadwood 🪵☠️",
    "TimeWood": "Ancient Tree 🌳⏳",
    "SpaceWood": "Cosmic Tree 🌳🌌",
    "SoundWood": "Wooden Instrument 🎻",
    "GravityWood": "Falling Leaves 🍂",
    "WaterLight": "Refraction 🌈💧",
    "FireLight": "Flame Aura 🔥✨",
    "EarthLight": "Bioluminescent Cave 🕯️🦠",
    "WindLight": "Aurora 🌠",
    "IceLight": "Halo ☀️❄️",
    "LightningLight": "Plasma ⚡💡",
    "RockLight": "Crystal 💎✨",
    "DarkLight": "Twilight 🌅🌌",
    "LifeLight": "Bioluminescence 🦠💡",
    "DeathLight": "Fading Light 💡➡️🌑",
    "TimeLight": "Light Year 💡🌌",
    "SpaceLight": "Starlight ⭐💡",
    "SoundLight": "Photoacoustic Effect 🔊💡",
    "GravityLight": "Gravitational Lensing 🔍🌌",
    "WaterDark": "Deep Ocean 🌊🌑",
    "FireDark": "Smoldering Embers 🔥🌑",
    "EarthDark": "Underground 🕳️🌑",
    "WindDark": "Night Wind 🌬️🌙",
    "IceDark": "Polar Night ❄️🌑",
    "LightningDark": "Storm Clouds ⚡☁️",
    "RockDark": "Cave System 🕳️🪨",
    "LifeDark": "Nocturnal Creatures 🦉🌙",
    "DeathDark": "Oblivion 🌑☠️",
    "TimeDark": "Eternal Night 🌑⏳",
    "SpaceDark": "Intergalactic Void 🌌🕳️",
    "SoundDark": "Eerie Silence 🤫🌑",
    "GravityDark": "Dark Matter 🌌🕳️",
    "WaterLife": "Marine Ecosystem 🐠🌊",
    "FireLife": "Extremophile 🦠🔥",
    "EarthLife": "Biodiversity 🌍🦜",
    "WindLife": "Airborne Microbes 🦠💨",
    "IceLife": "Arctic Ecosystem 🐧❄️",
   };
});