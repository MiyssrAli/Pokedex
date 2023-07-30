let currentPokemon;
let loadedPokemon = 15;
let currentLoaded = 1; // Variable, um den Startpunkt der API-Abfrage festzulegen
let pokeList = [];

function init() {
  loadPokemon();
  document.getElementById("searchQuery").addEventListener("input", filterpokemon);
}

async function filterpokemon() {
  const query = document.getElementById("searchQuery").value.toLowerCase(); // Suchanfrage in Kleinbuchstaben konvertieren
  const filteredPokemon = pokeList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(query)
  );
  // Alle Pokémon-Karten verstecken
  const allPokemonCards = document.querySelectorAll(".poke-wrap-card");
  allPokemonCards.forEach((card) => (card.style.display = "none"));
  // Nur die gefilterten Pokémon-Karten anzeigen
  filteredPokemon.forEach((pokemon) => {
    const id = pokemon.id;
    const card = document.getElementById(`poke-wrap${id}`);
    if (card) {card.style.display = "block";}
  });
}

function loadMorePokemon() {
  // Überprüfen, ob das Eingabefeld einen Wert hat
  const searchQuery = document.getElementById("searchQuery").value;
  if (searchQuery === "") { // Nur wenn das Eingabefeld leer ist, können weitere Pokémon geladen werden
    if (loadedPokemon >= 151) {
    }
    loadedPokemon += 30;
    if (loadedPokemon > 151) {
      loadedPokemon = 151;
    }
    loadPokemon();
  } 
}

async function loadPokemon() {
  for (let i = currentLoaded; i <= loadedPokemon; i++) {
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    let response = await fetch(url);
    let currentPokemon = await response.json();
    pokeList.push(currentPokemon);
    document.getElementById("pokemon-deck").innerHTML += renderPokeCard(i,currentPokemon); // Das gerenderte Pokémon-Karten-HTML an das 'pokemon-deck'-Element anhängen
    renderPokeInfos(i, currentPokemon); // Die Informationen des aktuellen Pokémon in der Karte anzeigen
    console.log("Das ist Pokémon", i, currentPokemon); // Konsolenausgabe der Informationen des aktuellen Pokémon
    changeBackgroundColor();
  }
  currentLoaded = loadedPokemon + 1; // Aktualisieren Sie den Startpunkt für die nächste API-Abfrage
}

function renderPokeCard(i, currentPokemon) {
  // rendert die kleinen pokemon karten auf der seite
  return `
    <div onclick="openPokePopUp(${i})" id="poke-wrap${i}" class="poke-wrap-card">
      <div class="name-and-nr-div">
        <h3 id="pokemonName1${i}">${currentPokemon["name"]}</h3>
        <span id="pokemonNummer2${i}">#${currentPokemon["id"]}</span>
      </div>
      <div class="display-flex">
        <div class="info-type1">
        <span id="type${i}">${currentPokemon["types"][0]["type"]["name"]}</span>
        
        </div>
        <div class="poke-wrap-img-div">
          <img id="pokemonImg1${i}" src="${currentPokemon["sprites"]["other"]["official-artwork"]["front_default"]}" alt="">
        </div>
      </div>
    </div>
  `;
}

function renderPokeInfos(i, currentPokemon) {
  // Funktion, um die Informationen des Pokémon in der Karte anzuzeigen
  document.getElementById(`pokemonNummer2${i}`).innerHTML ="#" + currentPokemon["id"];
  document.getElementById(`pokemonName1${i}`).innerHTML = currentPokemon["name"];
  document.getElementById(`pokemonImg1${i}`).src = currentPokemon["sprites"]["other"]["official-artwork"]["front_default"];
  const type1 = currentPokemon["types"][0]["type"]["name"];
  const type2 = currentPokemon["types"][1] ? currentPokemon["types"][1]["type"]["name"]: null;
  document.getElementById(`type${i}`).innerHTML = `<span class="type1">${type1}</span><br><br>`;
  if (type2) {
    document.getElementById(`type${i}`).innerHTML += `<span class="type1">${type2}</span>`;
  }
}

function changeBackgroundColor() {
  const typeColors = {
    grass: "#4EC2A8",fire: "#F7796B",water: "#57ACF6",
    bug: "#9CAD1A",normal: "#B3B3AA",ground: "#E0B558",
    electric: "#FCC43E",poison: "#953594", fairy: "#EEA5B3",
    fighting: "#a9807c",rock: "#E0B558", ghost: "rgb(0 0 0 / 72%)",
    psychic: "#ed34c8",ice: "#A6D6F1",dragon: "#9F0101",
  };
  pokeList.forEach((pokemon, index) => {
    const type = pokemon["types"][0]["type"]["name"];
    const backgroundColor = typeColors[type] || "#FFFFFF";
    const containerId = `poke-wrap${index + 1}`;
    const containerElement = document.getElementById(containerId);
    if (containerElement) {
      containerElement.style.backgroundColor = backgroundColor;
    }
  });
}

function changeBackgroundColorPokedex(pokemonId) {
  // Ändert die Hintergrundfarbe der Pokémon-Karten basierend auf dem Pokémon-Typ im PopUp
  const pokemon = pokeList[pokemonId - 1];
  let type1 = pokemon["types"][0]["type"]["name"];
  const typeColors = {
    grass: "#4EC2A8",fire: "#F7796B",water: "#57ACF6",
    bug: "#9CAD1A",normal: "#B3B3AA",ground: "#E0B558",
    electric: "#FCC43E",poison: "#953594",fairy: "#EEA5B3",
    fighting: "#a9807c",rock: "#E0B558",ghost: "rgb(0 0 0 / 72%)",
    psychic: "#ed34c8",ice: "#A6D6F1",dragon: "#9F0101",
  };
  const backgroundColor = typeColors[type1] || "#FFFFFF"; // Hintergrundfarbe basierend auf dem Typ des Pokémon erhalten
  document.getElementById("pokedex").style.backgroundColor = backgroundColor;
}

function updatePokeImgNameNumbert(pokemon) {
  document.getElementById("pokemonImg").src =
    pokemon["sprites"]["other"]["official-artwork"]["front_default"];
  document.getElementById("pokemonName").innerText = pokemon["name"];
  document.getElementById("pokemonNummer").innerText = "#" + pokemon["id"];
}

function updatePokeHeightWeightAbility(pokemon) {
  document.getElementById("pokemon-Height").innerText =(pokemon["height"] / 10).toFixed(1) + " m ";
  document.getElementById("pokemon-weight").innerText =(pokemon["weight"] / 10).toFixed(1) + " kg ";
  document.getElementById("pokemon-abilities").innerText = pokemon["abilities"].map((ability) => ability["ability"]["name"]).join(", ");
}

function openPokePopUp(pokemonId) {  // Funktion, um das Popup des ausgewählten Pokémon zu öffnen
 
  const pokemon = pokeList[pokemonId - 1];
  updatePokeImgNameNumbert(pokemon);
  let type1 = pokemon["types"][0]["type"]["name"];
  const type2 = pokemon["types"][1]? pokemon["types"][1]["type"]["name"]: null;
  document.getElementById("type").innerHTML = `<span class="type1">${type1}</span>`;
  if (type2) {
    // Den zweiten Typ des Pokémon im Popup anzeigen, falls vorhanden
    document.getElementById("type").innerHTML += `<span class="type1">${type2}</span>`;
}
  document.getElementById("info-type").innerHTML = `<span class="type1">${type1}</span>`; ////////// im table die types der pokecardpopUp ///////////
  if (type2) {
    document.getElementById("info-type").innerHTML += `<span class="type1">${type2}</span>`;
  }
  updatePokeHeightWeightAbility(pokemon);
  changeBackgroundColorPokedex(pokemonId);
  updateStatsTable(pokemon["stats"]);
  showMoves(pokemonId);
  document.getElementById("popUpDialog").classList.remove("d-none");
}

function closePokePopUp() { // Funktion, um das Popup zu schließen
  
  document.getElementById("popUpDialog").classList.add("d-none");
  hideSections();
  about();
}

function updateStatsTable(stats) {  // Funktion, um die Stats des Pokémon in die Tabelle einzufügen
 
  const statsTable = document.getElementById("stats-table");
  statsTable.innerHTML = ""; // Vorherige Einträge löschen, um Überschneidungen zu vermeiden
  for (const stat of stats) {
    const statName = stat["stat"]["name"];
    const baseStat = stat["base_stat"];
    statsTable.innerHTML += `
      <tr>
        <td><b>${capitalizeFirstLetter(statName)}:</b></td>
        <td>
          <div class="progress" role="progressbar" aria-label="${statName} example">
            <div class="progress-bar bg-success" style="width: ${baseStat}% "><span>${baseStat}</span></div>
          </div>
        </td>
      </tr>
    `;
  }
}

function capitalizeFirstLetter(str) {
  // Funktion, um den ersten Buchstaben eines Strings groß zu machen
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function showMoves(pokemonId) { // Zeigt alle moves von den pokemon an
  const pokemon = pokeList[pokemonId - 1]; // Das ausgewählte Pokémon aus der pokeList holen, indem die ID angepasst wird
  const movesContainer = document.getElementById("moves");
  movesContainer.innerHTML = ""; // Vorhandene Attacken löschen, falls vorhanden, um sie später neu zu rendern
  // Schleife durch jede Attacke des ausgewählten Pokémon
  for (const move of pokemon["moves"]) {
    const moveName = move["move"]["name"]; // Den Namen der aktuellen Attacke aus dem move-Objekt extrahieren
    const spanElement = document.createElement("span"); // Ein neues <span>-Element erstellen
    spanElement.setAttribute("id", `moves${pokemonId}`); // Dem <span>-Element eine ID geben, die sich von der Pokémon-ID ableitet
    spanElement.textContent = moveName; // Den Text des <span>-Elements auf den Namen der Attacke setzen
    movesContainer.appendChild(spanElement); // Das <span>-Element dem movesContainer hinzufügen, um die Attacke darzustellen
  }
}


/////////////////////////////////// info onclick function



function hideSections() {// Diese Funktion versteckt die Abschnitte mit den IDs 'section-11', 'section-22',und 'section-44'

  const sections = ["section-11", "section-22", "section-44"];
 
  for (const sectionId of sections) {  // Schleife, um durch die Liste der Abschnitts-IDs zu iterieren
    const section = document.getElementById(sectionId); // Das entsprechende Abschnittselement anhand der ID abrufen
    if (section) { // Wenn das Abschnittselement existiert, setze seine Anzeige auf 'none' (verstecken)
      section.style.display = "none";
    }
  }
}


function showSection(sectionId) { // Funktion zum Einblenden eines bestimmten Abschnitts und Verstecken der anderen
  // Alle Abschnitte zuerst verstecken
  hideSections();

  // Das Abschnittselement abrufen, das angezeigt werden soll
  const section = document.getElementById(sectionId);
  // Wenn das Abschnittselement existiert, setze seine Anzeige auf 'block' (einblenden)
  if (section) {
    section.style.display = "block";
  }
}

// Funktion zum Einblenden des Abschnitts 'section-11'
function about() {
  // Den Abschnitt 'section-11' einblenden
  showSection("section-11");
}

// Funktion zum Einblenden des Abschnitts 'section-22'
function basteStas() {
  // Den Abschnitt 'section-22' einblenden
  showSection("section-22");
}

// Funktion zum Einblenden des Abschnitts 'section-44'
function moves() {
  // Den Abschnitt 'section-44' einblenden
  showSection("section-44");
}


function changeImg() { ///// herz icon in rot ändern///////////////////
  let image = document.getElementById("picture");
  if (image.src.match("./img/herz.png")) {
    image.src = "./img/red-heart.png";
  } else {
    image.src = "./img/herz.png";
  }
}

