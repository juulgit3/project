// ============================================================
// BOLIGBOBLEN — app.js
// ============================================================

// === LOCATIONS ===
const LOCATIONS = {
  nørrebro: {
    name: "Nørrebro",
    basePriceMultiplier: 1.1,
    volatility: 0.22,
    description: "Høj volatilitet",
  },
  vesterbro: {
    name: "Vesterbro",
    basePriceMultiplier: 1.15,
    volatility: 0.15,
    description: "Medium volatilitet",
  },
  østerbro: {
    name: "Østerbro",
    basePriceMultiplier: 1.3,
    volatility: 0.1,
    description: "Lav volatilitet",
  },
  nordvest: {
    name: "Nordvest",
    basePriceMultiplier: 0.9,
    volatility: 0.3,
    description: "Meget høj volatilitet",
  },
  amager: {
    name: "Amager",
    basePriceMultiplier: 0.95,
    volatility: 0.18,
    description: "Medium volatilitet",
  },
  frederiksberg: {
    name: "Frederiksberg",
    basePriceMultiplier: 1.5,
    volatility: 0.08,
    description: "Lav volatilitet, høje priser",
  },
  sydhavn: {
    name: "Sydhavn",
    basePriceMultiplier: 0.85,
    volatility: 0.35,
    description: "Ekstrem volatilitet",
  },
};

// === PROPERTY TYPES ===
const PROPERTY_TYPES = {
  studio: {
    name: "Studio",
    basePrice: 1200000,
    riskLevel: "Lav",
    taglines: [
      '"Charmerende" (det er 32 kvm)',
      "Perfekt til én person — og ingen gæster",
      "Fuldt møbleret hvis du ikke rykker møblerne",
    ],
  },
  apartment: {
    name: "Lejlighed",
    basePrice: 2500000,
    riskLevel: "Medium",
    taglines: [
      "Altan mod gården (mod p-pladsen)",
      "Åben køkkenalrum — væggen er fjernet",
      "Udsigt til naboens vindue",
    ],
  },
  family: {
    name: "Familielejlighed",
    basePrice: 4200000,
    riskLevel: "Medium",
    taglines: [
      "Tre soveværelser — to er skabe",
      "Perfekt for en familie på maks 2,5",
      "Børnevenlig — der er en legeplads 400m væk",
    ],
  },
  coop: {
    name: "Andelsbolig",
    basePrice: 1800000,
    riskLevel: "Høj",
    taglines: [
      "Bestyrelsesmøde første mandag i måneden",
      "Andelsforeningen har stærke meninger",
      "Lavt månedligt bidrag — for nu",
    ],
  },
  fixerUpper: {
    name: "Renoveringsprojekt",
    basePrice: 900000,
    riskLevel: "Meget høj",
    taglines: [
      "Masser af potentiale (og fugt)",
      "Sælges som beset — sælger har set nok",
      "Håndværkertilbud: kan gøres hyggeligt",
    ],
  },
};

// === RENOVATIONS ===
const RENOVATIONS = {
  paintWhite: {
    name: "Malet hvid",
    valueBoost: 0.05,
    cost: 20000,
    emoji: "🎨",
  },
  newYorkerWall: {
    name: "New Yorker-væg",
    valueBoost: 0.10,
    cost: 50000,
    emoji: "🧱",
  },
  openPlan: {
    name: "Åben planløsning",
    valueBoost: 0.15,
    cost: 80000,
    emoji: "🔨",
  },
  walkInCloset: {
    name: "Walk-in closet",
    valueBoost: 0.08,
    cost: 30000,
    emoji: "👗",
  },
  quooker: {
    name: "Quooker",
    valueBoost: 0.12,
    cost: 25000,
    emoji: "💧",
  },
};

// === RANDOM EVENTS ===
const EVENTS = [
  {
    id: "priceSpikeLocal",
    category: "marked",
    text: (state) => `Priserne eksploderer i ${LOCATIONS[state.currentLocation].name}! Alle dine ejendomme der stiger 20%.`,
    emoji: "📈",
    effect: (state) => {
      state.properties.forEach((p) => {
        if (p.location === state.currentLocation) p.currentValue *= 1.2;
      });
    },
  },
  {
    id: "globalDrop",
    category: "marked",
    text: () => "Nationalbanken hæver renten. Alle ejendomsværdier falder 10%.",
    emoji: "📉",
    effect: (state) => {
      state.properties.forEach((p) => (p.currentValue *= 0.9));
    },
  },
  {
    id: "biddingWar",
    category: "kultur",
    text: () => "Budkrig! En af dine ejendomme er pludselig meget attraktiv. +15% værdi.",
    emoji: "⚔️",
    effect: (state) => {
      if (state.properties.length > 0) {
        const p = state.properties[Math.floor(Math.random() * state.properties.length)];
        p.currentValue *= 1.15;
      }
    },
  },
  {
    id: "buyerOverpays",
    category: "kultur",
    text: () => "En køber har ikke set lejligheden, men bød alligevel. Markedet er vanvittigt. +12% på tilfældig ejendom.",
    emoji: "🤦",
    effect: (state) => {
      if (state.properties.length > 0) {
        const p = state.properties[Math.floor(Math.random() * state.properties.length)];
        p.currentValue *= 1.12;
      }
    },
  },
  {
    id: "hiddenDamage",
    category: "risiko",
    text: () => "Skjult fugtskade opdaget! En af dine ejendomme falder 18% i værdi.",
    emoji: "💧",
    effect: (state) => {
      if (state.properties.length > 0) {
        const p = state.properties[Math.floor(Math.random() * state.properties.length)];
        p.currentValue *= 0.82;
      }
    },
  },
  {
    id: "coopBlocks",
    category: "risiko",
    text: () => "Andelsforeningen blokerer dit salg. Du kan ikke sælge andelsboliger i 2 dage.",
    emoji: "🚫",
    effect: (state) => {
      state.coopBlockedDays = 2;
    },
  },
  {
    id: "bankPressure",
    category: "personlig",
    text: () => "Banken ringer. De er nervøse for din gæld. Din rente fordobles i dag.",
    emoji: "🏦",
    effect: (state) => {
      if (state.debt > 0) state.debt *= 1.05;
    },
  },
  {
    id: "parentGuilt",
    category: "personlig",
    text: () => 'Din mor spørger om du "virkelig har brug for endnu en lejlighed." Du mister 10.000 kr i skyldfølelse.',
    emoji: "👩",
    effect: (state) => {
      if (state.debt > 0) state.cash -= 10000;
    },
  },
  {
    id: "localHype",
    category: "marked",
    text: (state) => `DR laver reportage om ${LOCATIONS[state.currentLocation].name}. Priserne stiger 8%.`,
    emoji: "📺",
    effect: (state) => {
      state.properties.forEach((p) => {
        if (p.location === state.currentLocation) p.currentValue *= 1.08;
      });
    },
  },
  {
    id: "renovation_discount",
    category: "kultur",
    text: () => "Håndværkerne har pludselig tid. Næste renovering koster 20% mindre. (Brug det nu!)",
    emoji: "🔧",
    effect: (state) => {
      state.renovationDiscount = true;
    },
  },
  {
    id: "newMetroLine",
    category: "marked",
    text: () => "Ny metrolinje annonceret! Alle ejendomme i Sydhavn og Nordvest stiger 15%.",
    emoji: "🚇",
    effect: (state) => {
      state.properties.forEach((p) => {
        if (p.location === "sydhavn" || p.location === "nordvest") p.currentValue *= 1.15;
      });
    },
  },
  {
    id: "influencerSpot",
    category: "kultur",
    text: () => "En influencer har spottet din bydel på Instagram. Alle priser stiger 5%.",
    emoji: "📸",
    effect: (state) => {
      state.properties.forEach((p) => (p.currentValue *= 1.05));
    },
  },
  {
    id: "noEvent",
    category: "ingen",
    text: () => "En stille dag på markedet. Ingen nyheder — endnu.",
    emoji: "☕",
    effect: () => {},
  },
];

// === HUMOROUS TAGLINES for market ===
const MARKET_QUIPS = [
  '"Udsigt til grønt område" (parkeringspladsen har et træ)',
  "Ejet af samme familie i 40 år — de vil gerne væk",
  "Prisfald? Det kalder vi en korrektion.",
  "Ingen servitutter. Vi har tjekket. Næsten.",
  "Energimærke F — men det er hyggeligt om vinteren",
  "Tæt på alt (det tager 35 min med bus)",
  '"Lys og luftigt" — sydvendt i teorien',
  "Sælges pga. skilsmisse. Begge parter vil bare af med det.",
];

// === GAME STATE ===
let state = {};

function initState() {
  state = {
    day: 1,
    cash: 500000,
    debt: 0,
    properties: [],
    currentLocation: "nørrebro",
    maxProperties: 3,
    coopBlockedDays: 0,
    renovationDiscount: false,
    lastEvent: null,
    propertyIdCounter: 1,
  };
}

// === PRICE ENGINE ===
function generatePrice(typeKey, locationKey, eventModifier = 0) {
  const type = PROPERTY_TYPES[typeKey];
  const loc = LOCATIONS[locationKey];
  const rand = (Math.random() * 0.45) - 0.2; // -0.2 to +0.25
  const multiplier = 1 + rand + loc.volatility * 0.5 + eventModifier;
  return Math.round(type.basePrice * loc.basePriceMultiplier * multiplier);
}

function updatePropertyValues() {
  state.properties.forEach((p) => {
    const loc = LOCATIONS[p.location];
    const rand = (Math.random() * 0.15) - 0.07;
    const change = 1 + rand + loc.volatility * 0.2;
    p.currentValue = Math.round(p.currentValue * change);
  });
}

// === MARKET GENERATION ===
function generateMarketListings() {
  const typeKeys = Object.keys(PROPERTY_TYPES);
  return typeKeys.map((typeKey) => {
    const price = generatePrice(typeKey, state.currentLocation);
    const quip = MARKET_QUIPS[Math.floor(Math.random() * MARKET_QUIPS.length)];
    return { typeKey, price, quip };
  });
}

let currentListings = [];

function refreshMarket() {
  currentListings = generateMarketListings();
}

// === ACTIONS ===

function buyProperty(typeKey, price) {
  if (state.properties.length >= state.maxProperties) {
    showToast("Du kan ikke eje mere end " + state.maxProperties + " ejendomme.");
    return;
  }
  if (state.cash < price) {
    showToast("Du har ikke råd. Overvej et lån.");
    return;
  }
  state.cash -= price;
  state.properties.push({
    id: state.propertyIdCounter++,
    type: typeKey,
    location: state.currentLocation,
    purchasePrice: price,
    currentValue: price,
    upgrades: [],
  });
  closeModal();
  refreshMarket();
  renderAll();
}

function sellProperty(propId) {
  const idx = state.properties.findIndex((p) => p.id === propId);
  if (idx === -1) return;
  const prop = state.properties[idx];

  if (prop.type === "coop" && state.coopBlockedDays > 0) {
    showToast("Andelsforeningen blokerer salget. Vent " + state.coopBlockedDays + " dag(e).");
    return;
  }

  state.cash += prop.currentValue;
  state.properties.splice(idx, 1);
  closeModal();
  renderAll();
}

function renovateProperty(propId, renovKey) {
  const prop = state.properties.find((p) => p.id === propId);
  if (!prop) return;

  if (prop.upgrades.includes(renovKey)) {
    showToast("Denne opgradering er allerede installeret.");
    return;
  }

  const renov = RENOVATIONS[renovKey];
  let cost = renov.cost;
  if (state.renovationDiscount) {
    cost = Math.round(cost * 0.8);
    state.renovationDiscount = false;
  }

  if (state.cash < cost) {
    showToast("Ikke råd til renovering. Koster " + fmt(cost));
    return;
  }

  state.cash -= cost;
  prop.currentValue = Math.round(prop.currentValue * (1 + renov.valueBoost));
  prop.upgrades.push(renovKey);
  closeModal();
  renderAll();
}

function takeLoan(type) {
  const max = type === "bank" ? 2000000 : 1000000;
  const label = type === "bank" ? "Banklån" : "Forældrelån";

  openModal(`
    <h3>${label}</h3>
    <p>Max: ${fmt(max)} · Rente: ${type === "bank" ? "5%" : "1%"} pr. dag<br>
    ${type === "parent" ? '<em>OBS: Øger risikoen for skyldfølelse-events.</em>' : ""}</p>
    <div class="modal-options">
      ${[100000, 250000, 500000, max].filter(a => a <= max).map(amount => `
        <button class="modal-option-btn" onclick="confirmLoan('${type}', ${amount})">
          <span class="opt-label">${fmt(amount)}</span>
          <span class="opt-detail">Daglig rente: ${fmt(Math.round(amount * (type === "bank" ? 0.05 : 0.01)))}</span>
        </button>
      `).join("")}
    </div>
  `);
}

function confirmLoan(type, amount) {
  state.cash += amount;
  state.debt += amount;
  closeModal();
  renderAll();
}

function applyInterest() {
  if (state.debt <= 0) return;
  // Approximate: bank loans at 5%, parent at 1%
  // We don't track separately, so we use a blended 3%
  state.debt = Math.round(state.debt * 1.03);
}

function triggerRandomEvent() {
  const pool = EVENTS.filter((e) => e.id !== "noEvent");
  const noEventChance = 0.25;
  let event;
  if (Math.random() < noEventChance) {
    event = EVENTS.find((e) => e.id === "noEvent");
  } else {
    event = pool[Math.floor(Math.random() * pool.length)];
  }
  event.effect(state);
  state.lastEvent = event;
  return event;
}

function travel(locationKey) {
  state.currentLocation = locationKey;
  refreshMarket();
  renderAll();
}

function nextDay() {
  if (state.day >= 30) return;

  state.day++;
  applyInterest();
  updatePropertyValues();

  if (state.coopBlockedDays > 0) state.coopBlockedDays--;

  const event = triggerRandomEvent();
  showEventBanner(event);

  refreshMarket();
  renderAll();

  if (state.day >= 30) {
    setTimeout(showEndScreen, 1200);
  }
}

// === END GAME ===
function showEndScreen() {
  const propertyTotal = state.properties.reduce((sum, p) => sum + p.currentValue, 0);
  const score = state.cash + propertyTotal - state.debt;

  let emoji, title, message;
  if (score >= 3000000) {
    emoji = "🦈"; title = "Real estate shark";
    message = "Du spillede markedet som en violin. Ejendomsmæglerne hader dig. Det er et kompliment.";
  } else if (score >= 1500000) {
    emoji = "😅"; title = "Du overlevede";
    message = "Ikke imponerende, ikke katastrofalt. Du er klar til et liv som hobbyinvestor.";
  } else if (score >= 500000) {
    emoji = "🍀"; title = "Lucky timing";
    message = "Du tjente penge, men mest fordi markedet var gunstigt. Fortæl det ikke til nogen.";
  } else {
    emoji = "😭"; title = "Du blev prissat ud";
    message = "Gæld, dårlige beslutninger og Nordvest. En klassisk kombination.";
  }

  document.getElementById("end-emoji").textContent = emoji;
  document.getElementById("end-title").textContent = title;
  document.getElementById("end-score").textContent = "Slutscore: " + fmt(score);
  document.getElementById("end-message").textContent = message;
  document.getElementById("end-screen").classList.remove("hidden");
}

function restartGame() {
  document.getElementById("end-screen").classList.add("hidden");
  initState();
  refreshMarket();
  renderAll();
}

// === MODALS ===
function openModal(html) {
  document.getElementById("modal-content").innerHTML = html;
  document.getElementById("modal-overlay").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.add("hidden");
}

function openBuyModal(idx) {
  const listing = currentListings[idx];
  const type = PROPERTY_TYPES[listing.typeKey];
  const canAfford = state.cash >= listing.price;
  const full = state.properties.length >= state.maxProperties;

  openModal(`
    <h3>${type.name}</h3>
    <p>${listing.quip}<br><br>
    <strong>Pris:</strong> ${fmt(listing.price)}<br>
    <strong>Bydel:</strong> ${LOCATIONS[state.currentLocation].name}<br>
    <strong>Risiko:</strong> ${type.riskLevel}</p>
    <div class="modal-options">
      <button class="modal-option-btn" onclick="buyProperty('${listing.typeKey}', ${listing.price})"
        ${!canAfford || full ? "disabled" : ""}>
        <span class="opt-label">Køb nu — ${fmt(listing.price)}</span>
        <span class="opt-detail">${full ? "Portefølje fuld" : !canAfford ? "Ikke råd" : "Bekræft køb"}</span>
      </button>
    </div>
  `);
}

function openSellModal(propId) {
  const prop = state.properties.find((p) => p.id === propId);
  if (!prop) return;
  const type = PROPERTY_TYPES[prop.type];
  const profit = prop.currentValue - prop.purchasePrice;
  const blocked = prop.type === "coop" && state.coopBlockedDays > 0;

  openModal(`
    <h3>Sælg ${type.name}</h3>
    <p>
      <strong>Købt for:</strong> ${fmt(prop.purchasePrice)}<br>
      <strong>Nuværende værdi:</strong> ${fmt(prop.currentValue)}<br>
      <strong>Gevinst/tab:</strong> <span style="color:${profit >= 0 ? "var(--green)" : "var(--red)"}">
        ${profit >= 0 ? "+" : ""}${fmt(profit)}</span>
      ${blocked ? '<br><br><em style="color:var(--red)">Andelsforeningen blokerer salget i ' + state.coopBlockedDays + ' dag(e).</em>' : ""}
    </p>
    <div class="modal-options">
      <button class="modal-option-btn" onclick="sellProperty(${propId})" ${blocked ? "disabled" : ""}>
        <span class="opt-label">Sælg for ${fmt(prop.currentValue)}</span>
        <span class="opt-detail">${blocked ? "Blokeret" : "Bekræft salg"}</span>
      </button>
    </div>
  `);
}

function openRenovateModal(propId) {
  const prop = state.properties.find((p) => p.id === propId);
  if (!prop) return;

  const options = Object.entries(RENOVATIONS).map(([key, r]) => {
    const owned = prop.upgrades.includes(key);
    let cost = r.cost;
    if (state.renovationDiscount) cost = Math.round(cost * 0.8);
    const canAfford = state.cash >= cost;
    return `
      <button class="modal-option-btn" onclick="renovateProperty(${propId}, '${key}')" ${owned || !canAfford ? "disabled" : ""}>
        <span class="opt-label">${r.emoji} ${r.name} ${owned ? "(installeret)" : ""}</span>
        <span class="opt-detail">+${Math.round(r.valueBoost * 100)}% værdi · Kost: ${fmt(cost)}${state.renovationDiscount && !owned ? " (20% rabat!)" : ""}</span>
      </button>
    `;
  }).join("");

  openModal(`
    <h3>Renovér ejendom</h3>
    <p>Vælg en opgradering til din ${PROPERTY_TYPES[prop.type].name} i ${LOCATIONS[prop.location].name}.</p>
    <div class="modal-options">${options}</div>
  `);
}

// === UI HELPERS ===
function fmt(n) {
  return Math.round(n).toLocaleString("da-DK") + " kr";
}

function showToast(msg) {
  // Simple: use event banner as toast
  const banner = document.getElementById("event-banner");
  document.getElementById("event-icon").textContent = "⚠️";
  document.getElementById("event-text").textContent = msg;
  banner.classList.remove("hidden");
  setTimeout(() => banner.classList.add("hidden"), 3000);
}

function showEventBanner(event) {
  const banner = document.getElementById("event-banner");
  document.getElementById("event-icon").textContent = event.emoji;
  document.getElementById("event-text").textContent = event.text(state);
  banner.classList.remove("hidden");
}

// === RENDER ===
function renderAll() {
  renderHeader();
  renderLocations();
  renderMarket();
  renderPortfolio();
}

function renderHeader() {
  document.getElementById("stat-day").textContent = state.day + " / 30";
  document.getElementById("stat-cash").textContent = fmt(state.cash);
  document.getElementById("stat-debt").textContent = fmt(state.debt);
  document.getElementById("stat-location").textContent = LOCATIONS[state.currentLocation].name;

  const btn = document.getElementById("btn-next-day");
  btn.disabled = state.day >= 30;
  btn.textContent = state.day >= 30 ? "Spillet er slut" : "Næste dag →";
}

function renderLocations() {
  const grid = document.getElementById("location-grid");
  grid.innerHTML = Object.entries(LOCATIONS).map(([key, loc]) => `
    <button class="location-btn ${key === state.currentLocation ? "active" : ""}" onclick="travel('${key}')">
      <span class="loc-name">${loc.name}</span>
      <span class="loc-vol">${loc.description}</span>
    </button>
  `).join("");
}

function renderMarket() {
  document.getElementById("market-location-name").textContent = LOCATIONS[state.currentLocation].name;
  const container = document.getElementById("market-listings");
  container.innerHTML = currentListings.map((listing, idx) => {
    const type = PROPERTY_TYPES[listing.typeKey];
    return `
      <div class="listing-card">
        <div class="listing-header">
          <span class="listing-type">${type.name}</span>
          <span class="listing-price">${fmt(listing.price)}</span>
        </div>
        <div class="listing-tagline">${listing.quip}</div>
        <div class="listing-footer">
          <span class="listing-risk">Risiko: ${type.riskLevel}</span>
          <button class="btn btn-small" onclick="openBuyModal(${idx})">Køb →</button>
        </div>
      </div>
    `;
  }).join("");
}

function renderPortfolio() {
  const container = document.getElementById("portfolio-list");
  if (state.properties.length === 0) {
    container.innerHTML = `<p class="empty-msg">Du ejer ingen ejendomme endnu.<br><small>"Første skridt er altid det sværeste — og dyrest."</small></p>`;
    return;
  }

  container.innerHTML = state.properties.map((prop) => {
    const type = PROPERTY_TYPES[prop.type];
    const loc = LOCATIONS[prop.location];
    const profit = prop.currentValue - prop.purchasePrice;
    const upgradeNames = prop.upgrades.map((u) => RENOVATIONS[u].emoji + " " + RENOVATIONS[u].name).join(", ");

    return `
      <div class="property-card">
        <div class="property-card-header">
          <span class="property-card-type">${type.name}</span>
          <span class="property-card-value">${fmt(prop.currentValue)}</span>
        </div>
        <div class="property-card-loc">📍 ${loc.name} · Købt for ${fmt(prop.purchasePrice)}
          <span style="color:${profit >= 0 ? "var(--green)" : "var(--red)"}; margin-left:6px">
            ${profit >= 0 ? "▲" : "▼"} ${fmt(Math.abs(profit))}
          </span>
        </div>
        ${upgradeNames ? `<div class="property-card-upgrades">${upgradeNames}</div>` : ""}
        <div class="property-card-actions">
          <button class="btn btn-small" onclick="openSellModal(${prop.id})">Sælg</button>
          <button class="btn btn-small" onclick="openRenovateModal(${prop.id})">Renovér</button>
        </div>
      </div>
    `;
  }).join("");
}

// === INIT ===
initState();
refreshMarket();
renderAll();
