// Define combinations at the top level so it's accessible throughout the script
const combinations = {
    "WaterWind": "Storm 🌩️",
    "FireRock": "Lava 🌋",
    // ... (add more combinations as needed)
};

document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('itemsContainer');
    const combineButton = document.getElementById('combineButton');
    const resultModal = document.getElementById('resultModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeModal = document.getElementById('closeModal');

    // Create score display element
    const scoreDisplay = document.createElement('div');
    scoreDisplay.id = 'scoreDisplay';
    document.querySelector('.container').insertBefore(scoreDisplay, itemsContainer);

    // Check if all necessary elements exist
    if (!itemsContainer || !combineButton || !resultModal || !modalMessage || !closeModal || !scoreDisplay) {
        console.error("One or more required elements are missing from the HTML.");
        return; // Exit the script if any element is missing
    }

    let selectedItems = [];
    let userScore = 0;
    let craftedItems = [];

    // Load saved data
    loadProgress();

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

    // Initialize item click events for existing items
    document.querySelectorAll('.item').forEach(addItemClickEvent);

    combineButton.addEventListener('click', () => {
        if (selectedItems.length === 1) {
            showModal("Select another item to combine with.");
        } else if (selectedItems.length === 2) {
            const result = checkCombination(selectedItems[0].dataset.item, selectedItems[1].dataset.item);
            if (result) {
                showModal(`Result of combination: ${result}`);
                addNewItem(result); // Simulate adding a new item
                updateScore();
                saveProgress();
            } else {
                showModal("No valid combination exists.");
            }
            selectedItems.forEach(i => i.classList.remove('selected'));
            selectedItems = [];
        } else {
            showModal("Please select two items to combine!");
        }
    });

    function checkCombination(item1, item2) {
        return combinations[item1 + item2] || combinations[item2 + item1];
    }

    function addNewItem(result) {
        const [emoji, newItemName] = result.split(' ');
        const existingItem = Array.from(document.querySelectorAll('.item')).find(item => item.dataset.item === newItemName);

        // Only add the new item if it doesn't already exist
        if (!existingItem && !craftedItems.includes(newItemName)) {
            craftedItems.push(newItemName);
            saveProgress();

            // Create a new button as a freshly made item
            createItemButton(emoji, newItemName);
        }
    }

    function createItemButton(emoji, itemName) {
        const newItem = document.createElement('button');
        newItem.className = 'item'; // Ensure it has the correct class for styling
        newItem.dataset.item = itemName;
        newItem.textContent = `${emoji} ${itemName}`;
        
        itemsContainer.appendChild(newItem);
        addItemClickEvent(newItem); // Attach click event for newly created item
    }

    function updateScore() {
        userScore++;
        scoreDisplay.textContent = `Score: ${userScore}`;
        saveProgress();
    }

    function saveProgress() {
        localStorage.setItem('userScore', userScore);
        localStorage.setItem('craftedItems', JSON.stringify(craftedItems));
    }

    function loadProgress() {
        userScore = parseInt(localStorage.getItem('userScore')) || 0;
        craftedItems = JSON.parse(localStorage.getItem('craftedItems')) || [];

        // Update score display
        scoreDisplay.textContent = `Score: ${userScore}`;

        // Recreate crafted items as fresh buttons
        craftedItems.forEach(item => {
            const fullItemNameEntry = Object.entries(combinations).find(([key, value]) => value.split(' ')[1] === item);
            if (fullItemNameEntry) {
                const [key, fullValue] = fullItemNameEntry;
                const [emoji, itemName] = fullValue.split(' ');
                createItemButton(emoji, itemName); // Create button as if freshly made
            }
        });
    }

    function showModal(message) {
        modalMessage.textContent = message;
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
});