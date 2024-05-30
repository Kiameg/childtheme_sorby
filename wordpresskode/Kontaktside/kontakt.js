// Lytter efter DOMContentLoaded-hændelsen for at sikre, at DOM'en er indlæst før kodens udførelse
document.addEventListener("DOMContentLoaded", function () {
  // Hent purposeField fra DOM'en
  const purposeField = document.getElementById("purpose");
  // Hent containeren med de betingede felter fra DOM'en
  const conditionalFields = document.getElementById("conditional-fields");

  // Tilføj en hændelseslytter til purposeField, der udføres når værdien ændres
  purposeField.addEventListener("change", function () {
    // Hvis værdien af purposeField er "tilmelding"
    if (this.value === "tilmelding") {
      // Fjern klassen "hidden" fra containeren med de skjulte felter
      conditionalFields.classList.remove("hidden");
    } else {
      // Ellers tilføj klassen "hidden" til containeren med de skjulte felter
      conditionalFields.classList.add("hidden");
    }
  });
  // Hent containeren med spil fra DOM'en
  const gameContainer = document.getElementById("select-game-con");
  const gameSelect = gameContainer.querySelector(".select-game");
  const gameItems = gameContainer.querySelector(".select-game-items");
  // Hent alle spilafkrydsningsfelter fra DOM'en
  const gameCheckboxes = gameContainer.querySelectorAll('input[name="spil"]');

  // Tilføj en hændelseslytter til gameSelect, der udføres når der klikkes
  gameSelect.addEventListener("click", function () {
    if (gameItems.style.display === "block") {
      // Hvis displayegenskaben for gameitems containeren er "block"
      gameItems.style.display = "none";
      // Skift displayegenskaben til "none" for at skjule gameitems containeren
    } else {
      // Ellers skift displayegenskaben til "block" for at vise gameitems containeren
      gameItems.style.display = "block";
    }
  });

  function updateSelectedText() {
    // Konverter gameCheckboxes til et array og filtrer de valgte (checked) checkbokse
    const selectedText =
      Array.from(gameCheckboxes)
        .filter((checkbox) => checkbox.checked)
        // For hver valgte checkbox, hent tekstindholdet fra dens forælder node og trim mellemrum
        .map((checkbox) => checkbox.parentNode.textContent.trim())
        // Sammensæt de valgte spil til en enkelt streng, adskilt af kommaer, eller brug "Vælg Spil" hvis ingen er valgt
        .join(", ") || "Vælg Spil";

    // Opdater tekstindholdet af gameSelect elementet med den genererede streng
    gameSelect.textContent = selectedText;
  }

  // For hver checkbox er der en eventlistener på, der kører updateSelectedText
  gameCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("click", updateSelectedText);
  });
  //
});

// Hvis du har spil selecteren åben, og trykker ved siden af dens boks, så lukker den automatisk sammen igen
document.addEventListener("click", function (event) {
  const gameContainer = document.getElementById("select-game-con");
  if (!gameContainer.contains(event.target)) {
    gameContainer.querySelector(".select-game-items").style.display = "none";
  }
});

const sendButton = document.querySelector(".send_btn");
const sentMessage = document.querySelector(".confirmation_msg");

// Lytter efter clicks på send knappen, hvis der bliver klikket, køre den sentData funktion med eventet
sendButton.addEventListener("click", (e) => {
  sentData(e);
});

function sentData(e) {
  // Stopper submit knappen i at redirecte til en anden side
  e.preventDefault();
  const gameSelect = document.querySelector(".select-game");
  const purposeField = document.getElementById("purpose");
  const conditionalFields = document.getElementById("conditional-fields");
  // Nulstil værdien af formålsfeltet
  purposeField.value = "";
  // Hvis både gameselect og containeren med de skjulte spørgsmål er til stede
  if (gameSelect && conditionalFields) {
    // Så nulstil teksten i gameselect og tilføj classen "hidden" til containeren for at skjule den
    gameSelect.textContent = "Vælg Spil";
    conditionalFields.classList.add("hidden");
  }

  // Ryder formens input felter
  e.target.form.reset();
  // Viser "Din besked er sendt"
  sentMessage.style.display = "block";
}
