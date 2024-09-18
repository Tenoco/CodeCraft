document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('itemsContainer');
    const combineButton = document.getElementById('combineButton');
    const resultModal = document.getElementById('resultModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeModal = document.getElementById('closeModal');

    let selectedItems = [];
    let userScore = getCookie('userScore') ? parseInt(getCookie('userScore')) : 0;
    let craftedItems = getCookie('craftedItems') ? JSON.parse(getCookie('craftedItems')) : [];
    let combinations = {};

    // Fetch combinations from craft.txt in the same repository
    fetch('./craft.txt')
        .then(response => response.text())
        .then(data => {
            data.trim().split('\n').forEach(line => {
                const [key, value] = line.split('=');
                combinations[key.trim()] = value.trim();
            });
            initializeCraftedItems();
        })
        .catch(error => console.error('Error fetching combinations:', error));

    function initializeCraftedItems() {
        craftedItems.forEach(itemName => {
            const newItem = createItemButton(itemName);
            itemsContainer.appendChild(newItem);
            addItemClickEvent(newItem);
        });
        
        // Initialize item click events for existing items
        document.querySelectorAll('.item').forEach(addItemClickEvent);
    }

    function createItemButton(itemName) {
        const newItem = document.createElement('button');
        newItem.className = 'item';
        newItem.dataset.item = itemName;
        newItem.textContent = itemName;
        return newItem;
    }

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

    combineButton.addEventListener('click', () => {
        if (selectedItems.length === 1) {
            modalMessage.textContent = "Select another item to combine with.";
            showModal();
        } else if (selectedItems.length === 2) {
            const result = checkCombination(selectedItems[0].dataset.item, selectedItems[1].dataset.item);
            if (result) {
                modalMessage.textContent = `Result of combination: ${result}`;
                addNewItem(result.split(" ")[0]);
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
        return combinations[`${item1}+${item2}`] || combinations[`${item2}+${item1}`];
    }

    function addNewItem(newItemName) {
        if (!craftedItems.includes(newItemName)) {
            craftedItems.push(newItemName);
            setCookie('craftedItems', JSON.stringify(craftedItems), 365);

            const newItem = createItemButton(newItemName);
            itemsContainer.appendChild(newItem);
            addItemClickEvent(newItem);
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
});