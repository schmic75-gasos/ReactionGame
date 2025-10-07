let gridSize = 3; // Začínáme s 3x3 mřížkou
let timeRemaining = 15; // Časový limit na 30 sekund
let score = 0; // Počáteční skóre
let interval;
let differenceIndex;

const gridContainer = document.getElementById('grid');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score'); // Přidáno pro zobrazení skóre
const notificationsContainer = document.createElement('div'); // Kontejner pro notifikace
notificationsContainer.id = 'notifications';
document.body.appendChild(notificationsContainer); // Přidáme kontejner na konec těla stránky

function startGame() {
    resetTimer(); // Resetujeme časovač
    score = 0; // Reset skóre na začátku hry
    updateScoreDisplay();
    showNotification("Hra začala! Najdi odlišné políčko.", "info");
    createGrid();
}

function resetTimer() {
    clearInterval(interval); // Zastavíme případný starý časovač
    timeDisplay.textContent = timeRemaining; // Aktualizujeme zobrazení času
    interval = setInterval(() => {
        timeRemaining--;
        timeDisplay.textContent = timeRemaining;

        if (timeRemaining <= 0) {
            clearInterval(interval);
            showNotification(`Hra skončila! Vypršel čas. Celkové skóre: ${score}`, "error");
        }
    }, 1000);
}

function createGrid() {
    gridContainer.innerHTML = ''; // Resetujeme mřížku
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    let gridItems = [];

    // Vytvoření mřížky
    for (let i = 0; i < gridSize * gridSize; i++) {
        let div = document.createElement('div');
        div.addEventListener('click', () => handleClick(i));
        gridItems.push(div);
        gridContainer.appendChild(div);
    }

    // Nastavení barev políček
    setDifferentColor(gridItems);
}

function setDifferentColor(gridItems) {
    let normalColor = getRandomHSL();
    let normalLightness = normalColor.lightness;
    let differentLightness = normalLightness + 10; // Zvýšíme světlost o 10%

    // Zajistíme, aby rozdílná světlost nepřekročila 100%
    if (differentLightness > 100) {
        differentLightness = normalLightness - 10;
    }

    // Vybereme náhodné políčko pro odlišnou barvu
    differenceIndex = Math.floor(Math.random() * gridItems.length);

    gridItems.forEach((item, index) => {
        if (index === differenceIndex) {
            item.style.backgroundColor = `hsl(${normalColor.hue}, ${normalColor.saturation}%, ${differentLightness}%)`;
            item.classList.add('different');
        } else {
            item.style.backgroundColor = `hsl(${normalColor.hue}, ${normalColor.saturation}%, ${normalLightness}%)`;
        }
    });
}

function getRandomHSL() {
    const hue = Math.floor(Math.random() * 360); // Náhodný odstín (0–360°)
    const saturation = 50 + Math.random() * 50; // Sytost (50–100%)
    const lightness = 40 + Math.random() * 20; // Jas (40–60%)
    return { hue, saturation, lightness };
}

function handleClick(index) {
    if (index === differenceIndex) {
        showNotification('Správně! Našel jsi odlišné políčko!', "success");
        score += 10; // Přidání bodů za správnou odpověď
        updateScoreDisplay();
        gridSize++; // Zvýšení velikosti mřížky
        if (gridSize > 9) gridSize = 9; // Maximální velikost mřížky
        timeRemaining += 3; // Přidání času jako odměna
        resetTimer(); // Obnovení časovače
        createGrid(); // Nová mřížka
    } else {
        showNotification('Špatně! Zkus to znovu.', "error");
        score -= 5;
        updateScoreDisplay();
    }
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `Skóre: ${score}`; // Aktualizace zobrazení skóre
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notificationsContainer.appendChild(notification);

    // Přidáme animaci zobrazení
    requestAnimationFrame(() => {
        notification.style.transform = "translateX(0)";
    });

    // Automatické odstranění notifikace po 3 sekundách
    setTimeout(() => {
        notification.style.transform = "translateX(100%)";
        notification.addEventListener('transitionend', () => {
            notification.remove();
        });
    }, 3000);
}

// CSS styly pro notifikace
const style = document.createElement('style');
style.textContent = `
  #notifications {
    position: fixed;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 1000;
  }

  .notification {
    background-color: #ddd;
    color: #333;
    padding: 10px 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transform: translateX(100%);
    transition: transform 0.5s ease;
    white-space: nowrap;
  }

  .notification.success {
    background-color: #4CAF50;
    color: white;
  }

  .notification.error {
    background-color: #f44336;
    color: white;
  }

  .notification.info {
    background-color: #2196F3;
    color: white;
  }

  .notification.warning {
    background-color: #FF9800;
    color: white;
  }
`;
document.head.appendChild(style);

// Start hry po načtení
startGame();
