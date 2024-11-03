const BACKEND_URL = "https://dawg-t2ik.onrender.com"

document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const enterButton = document.getElementById('enterButton');
    const cardContainer = document.getElementById('cardContainer');
    const resultDisplay = document.getElementById('resultDisplay');

    let selectedCardId = null;

    // Fetch initial list of cards
    const fetchInitialCards = async () => {
        try {
            const response = await fetch(BACKEND_URL + '/plugins');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching initial cards:', error);
            return [];
        }
    };

    // Send user input and get percentage result
    const sendUserInput = async (input, cardId) => {
        try {
            const response = await fetch(BACKEND_URL + `/plugins/exec/${cardId}?prompt=${input}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input, cardId }),
            });
            var data = await response.text();
            data = Number(data)

            if (data >= 0 && data <= 0.25) {
                return `Hell No. (${data * 100}%)`
            }
            else if (data >= 0.25 && data <= 0.50) {
                return `Nah. (${data * 100}%)`
            }
            else if (data >= 0.5 && data <= 0.75) {
                return `yeaaaaaaaaaaah (${data * 100}%)`
            }
            else {
                return `YES. (${data * 100}%)`
            }
        } catch (error) {
            console.error('Error processing input:', error);
            return 'Error occurred';
        }
    };

    const createCard = (item) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h1>${item.name}</h1>
                            <p>${item.description}</p>`
        card.dataset.id = item._id;

        card.addEventListener('click', () => {
            if (selectedCardId !== item._id) {
                if (selectedCardId !== null) {
                    const previousSelected = document.querySelector(`.card[data-id="${selectedCardId}"]`);
                    if (previousSelected) {
                        previousSelected.classList.remove('selected');
                    }
                }
                card.classList.add('selected');
                selectedCardId = item._id;
                console.log(`Selected card ID: ${selectedCardId}`);
            }
        });

        return card;
    };

    const handleEnter = async () => {
        const inputValue = userInput.value.trim();
        if (inputValue && selectedCardId) {
            resultDisplay.textContent = 'Processing...';
            try {
                const result = await sendUserInput(inputValue, selectedCardId);
                resultDisplay.textContent = `${result}`;
            } catch (error) {
                console.error('Error processing input:', error);
                resultDisplay.textContent = 'Error processing input. Please try again.';
            }
        } else {
            resultDisplay.textContent = 'Please enter input and select a card.';
        }
    };

    enterButton.addEventListener('click', handleEnter);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleEnter();
        }
    });

    // Load initial cards
    (async () => {
        cardContainer.innerHTML = 'Loading cards...';
        const initialCards = await fetchInitialCards();
        cardContainer.innerHTML = '';
        initialCards.forEach(item => {
            const card = createCard(item);
            cardContainer.appendChild(card);
        });
    })();
});
