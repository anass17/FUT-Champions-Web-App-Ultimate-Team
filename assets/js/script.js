"use strict";
var _a, _b, _c, _d, _e, _f, _g;
const url = 'https://raw.githubusercontent.com/anass17/JSON/refs/heads/main/Players/players.json';
let playersList = document.getElementById('players-list');
let playersCount = 0;
let switchCards = false;
let localStadium = [];
let localStadiumClasses = [];
let selectedPlayersPlaceholders = document.querySelectorAll('.selected-player');
let currentPlayerPlaceholder = null;
let currentPlayerCard = null;
let modal = document.getElementById('modal-container');
let inputs = modal.querySelectorAll('input, select');
let modalModifyBtn = modal.querySelector('.modify-player');
let formationSelect = document.getElementById('formation-select');
playersList.innerHTML = '';
let localST = localStorage.getItem('stadium');
if (!localST) {
    localStadium = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    localStadiumClasses = ["GK", "LB", "CB1", "CB2", "RB", "LM", "CM1", "CM2", "RM", "ST1", "ST2"];
    localStorage.setItem('stadium', JSON.stringify(localStadium));
    localStorage.setItem('stadium-classes', JSON.stringify(localStadiumClasses));
    localStorage.setItem('formation', 'GK-LB-CB1-CB2-RB-LM-CM1-CM2-RM-ST1-ST2');
}
else {
    localStadium = JSON.parse(localST);
    localStadiumClasses = JSON.parse(localStorage.getItem('stadium-classes'));
}
formationSelect.value = localStorage.getItem('formation');
[...selectedPlayersPlaceholders].forEach((item, index) => {
    item.parentElement.className = `selected-player-container ${localStadiumClasses[index]}`;
    item.dataset.position = localStadiumClasses[index].replace(/[0-9]/, "");
    try {
        item.querySelector('.role').textContent = localStadiumClasses[index].replace(/[0-9]/, "");
    }
    catch (_a) {
    }
});
let fetchSuccess = (data) => {
    for (let player of data.players) {
        if (localStadium.includes(player.id)) {
            updateContent(selectedPlayersPlaceholders[localStadium.indexOf(player.id)], player);
            addPlayerCard(player, true);
        }
        else {
            addPlayerCard(player, false);
        }
    }
    // playersCount = data.players.length;
    // LocalStorage
    localPlayersList = data.players;
    localStorage.setItem('players', JSON.stringify(localPlayersList));
};
//------------------------------------------------
// *** Store/Retrieve Players from LocalStorage
//------------------------------------------------
let localPlayersList;
if (!localStorage.getItem('players')) {
    fetch(url)
        .then(response => response.json())
        .then(fetchSuccess)
        .catch(error => console.log(error));
}
else {
    localPlayersList = JSON.parse(localStorage.getItem('players'));
    for (let player of localPlayersList) {
        if (localStadium.includes(player.id)) {
            updateContent(selectedPlayersPlaceholders[localStadium.indexOf(player.id)], player);
            addPlayerCard(player, true);
        }
        else {
            addPlayerCard(player, false);
        }
    }
    // playersCount = localPlayersList.length;
}
selectedPlayersPlaceholders.forEach((item) => {
    item.addEventListener('click', showRelevantPlayers);
});
function updateContent(element, player) {
    element.classList.add('player-card');
    element.dataset.available = player.position.join('-');
    element.dataset.id = `${player.id}`;
    element.innerHTML = `<div class="card-header">
        <h3 class="player-position">${player.position[0]}</h3>
        <div>
            <img class="player-image" src="${player.player_image}" alt="">
        </div>
        <div>
            <b class="player-rating">${player.overall_rating}</b>
        </div>
    </div>
    <h3 class="player-name">${player.name}</h3>
    <div class="player-info">
        <span>Age: ${player.age}</span>
        <span>N.: ${player.player_number}</span>
    </div>
    <h4 class="player-ligue">${player.league}</h4>
    <div class="player-assets">
        <img src="${player.nation_icon}" alt="" class="player-flag">
        <img src="${player.club_logo}" alt="" class="player-club">
    </div>`;
}
function addPlayerCard(player, hidden) {
    let div = document.createElement('div');
    div.className = "player-card";
    if (hidden == true) {
        div.classList.add('already-selected');
    }
    div.dataset.id = `${player.id}`;
    div.dataset.position = player.position.join('-');
    div.addEventListener('click', addPlayerToStadium);
    div.innerHTML = `<div class="card-header">
        <h3 class="player-position">${player.position[0]}</h3>
        <div>
            <img class="player-image" src="${player.player_image}" alt="">
        </div>
        <div>
            <b class="player-rating">${player.overall_rating}</b>
        </div>
    </div>
    <h3 class="player-name">${player.name}</h3>
    <div class="player-info">
        <span>Age: ${player.age}</span>
        <span>N.: ${player.player_number}</span>
    </div>
    <h4 class="player-ligue">${player.league}</h4>
    <div class="player-assets">
        <img src="${player.nation_icon}" alt="" class="player-flag">
        <img src="${player.club_logo}" alt="" class="player-club">
    </div>
    <button class="delete-btn" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="15" hidden="15" fill="red"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg></button>
    <button class="modify-btn" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="15" hidden="15" fill="#555"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg></button>`;
    div.querySelector('.delete-btn').addEventListener('click', function (e) {
        var _a, _b, _c;
        e.stopPropagation();
        let playerId = +((_a = this.parentElement) === null || _a === void 0 ? void 0 : _a.dataset.id);
        let playerName = (_c = (_b = this.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector('.player-name')) === null || _c === void 0 ? void 0 : _c.textContent;
        createAlert("Player Deleted", `The player "${playerName}" was deleted`);
        updatePlayerLocalStorage(playerId);
        this.parentElement.remove();
        currentPlayerCard = null;
        resetCards();
    });
    div.querySelector('.modify-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        modal.style.display = "flex";
        modalModifyBtn.style.display = "block";
        formFillPlayerData(+this.parentElement.dataset.id, this.parentElement);
        modalModifyBtn.previousElementSibling.style.display = "none";
        modal.querySelector('h2').textContent = "Modify Existing Player";
    });
    playersList.append(div);
}
let modifyID = 0;
let modifiedElement = null;
function formFillPlayerData(id, element) {
    let player = localPlayersList.filter(item => item.id == id)[0];
    inputs[0].value = player.name;
    inputs[1].value = player.age + "";
    inputs[2].value = player.player_number + "";
    inputs[3].value = player.Pace + "";
    inputs[4].value = player.Shooting + "";
    inputs[5].value = player.Passing + "";
    inputs[6].value = player.Dribbling + "";
    inputs[7].value = player.Defending + "";
    inputs[8].value = player.Physical + "";
    inputs[9].value = player.nationality.toLowerCase();
    inputs[10].value = player.position[0];
    inputs[11].value = player.league;
    // player.
    modifyID = id;
    modifiedElement = element;
}
let modifyValidRegExp = [
    /^[a-zA-Z][a-z A-Z]*$/,
    /^[1-5][0-9]$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[a-z -_]+$/,
    /^[A-Z]+$/,
    /^[a-zA-Z 0-9]+$/,
    /\.*$/,
    /\.*$/,
];
(_a = modal.querySelector('.modify-player')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    let errors = false;
    for (let i = 0; i < inputs.length; i++) {
        let itemHTML = inputs[i];
        if (itemHTML.value.search(modifyValidRegExp[i]) >= 0) {
            itemHTML.style.borderColor = "";
        }
        else {
            itemHTML.style.borderColor = "red";
            errors = true;
        }
    }
    if (errors == true) {
        return;
    }
    let i;
    for (i = 0; i < localPlayersList.length; i++) {
        if (localPlayersList[i].id == modifyID) {
            break;
        }
    }
    const file = inputs[12].files[0];
    const file2 = inputs[13].files[0];
    if (file || file2) {
        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                updateArrData(reader, null, i);
            };
            reader.readAsDataURL(file);
        }
        if (file2) {
            const reader2 = new FileReader();
            reader2.onload = function () {
                updateArrData(null, reader2, i);
            };
            reader2.readAsDataURL(file2);
        }
    }
    else {
        updateArrData(null, null, i);
    }
});
function updateArrData(reader, reader2, i) {
    let data = {
        id: modifyID,
        name: inputs[0].value,
        age: +inputs[1].value,
        player_number: +inputs[2].value,
        Pace: +inputs[3].value,
        Shooting: +inputs[4].value,
        Passing: +inputs[5].value,
        Dribbling: +inputs[6].value,
        Defending: +inputs[7].value,
        Physical: +inputs[8].value,
        overall_rating: Math.round((+inputs[3].value
            + +inputs[4].value
            + +inputs[5].value
            + +inputs[6].value
            + +inputs[7].value
            + +inputs[8].value) / 6),
        nationality: inputs[9].value,
        nation_icon: `https://www.countryflags.com/wp-content/uploads/${inputs[9].value}-flag-png-xl.png`,
        position: [inputs[10].value],
        league: inputs[11].value,
        club: "",
        player_image: (reader === null || reader === void 0 ? void 0 : reader.result) || localPlayersList[i].player_image,
        club_logo: (reader2 === null || reader2 === void 0 ? void 0 : reader2.result) || localPlayersList[i].club_logo,
    };
    localPlayersList[i] = data;
    modifyPlayer(modifiedElement, data);
    modal.style.display = 'none';
}
function modifyPlayer(element, player) {
    element.dataset.position = player.position[0];
    element.innerHTML = `<div class="card-header">
        <h3 class="player-position">${player.position[0]}</h3>
        <div>
            <img class="player-image" src="${player.player_image}" alt="">
        </div>
        <div>
            <b class="player-rating">${player.overall_rating}</b>
        </div>
    </div>
    <h3 class="player-name">${player.name}</h3>
    <div class="player-info">
        <span>Age: ${player.age}</span>
        <span>N.: ${player.player_number}</span>
    </div>
    <h4 class="player-ligue">${player.league}</h4>
    <div class="player-assets">
        <img src="${player.nation_icon}" alt="" class="player-flag">
        <img src="${player.club_logo}" alt="" class="player-club">
    </div>
    <button class="delete-btn" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="15" hidden="15" fill="red"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg></button>
    <button class="modify-btn" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="15" hidden="15" fill="#555"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg></button>
    `;
    element.querySelector('.delete-btn').addEventListener('click', function (e) {
        var _a, _b, _c;
        e.stopPropagation();
        let playerId = +((_a = this.parentElement) === null || _a === void 0 ? void 0 : _a.dataset.id);
        let playerName = (_c = (_b = this.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector('.player-name')) === null || _c === void 0 ? void 0 : _c.textContent;
        createAlert("Player Deleted", `The player "${playerName}" was deleted`);
        updatePlayerLocalStorage(playerId);
        this.parentElement.remove();
        currentPlayerCard = null;
        resetCards();
    });
    element.querySelector('.modify-btn').addEventListener('click', function (e) {
        e.stopPropagation();
        modal.style.display = "flex";
        modalModifyBtn.style.display = "block";
        formFillPlayerData(+this.parentElement.dataset.id, this.parentElement);
        modalModifyBtn.previousElementSibling.style.display = "none";
        modal.querySelector('h2').textContent = "Modify Existing Player";
    });
    createAlert("Modified Player", `The player "${player.name}" was modified`);
    localStorage.setItem('players', JSON.stringify(localPlayersList));
}
function createAlert(alertTitle, alertDesc) {
    let alert = document.createElement('div');
    alert.className = "alert";
    alert.innerHTML = `<h4>${alertTitle}</h4>
    <p>${alertDesc}</p>`;
    document.body.append(alert);
    setTimeout(() => {
        alert.className = "alert hide";
    }, 3000);
}
function updatePlayerLocalStorage(id) {
    localPlayersList = localPlayersList.filter(player => player.id != id);
    localStorage.setItem('players', JSON.stringify(localPlayersList));
}
function showRelevantPlayers() {
    var _a, _b, _c, _d, _e, _f;
    let position = this.dataset.position;
    if (this.classList.contains('active')) {
        currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.classList.remove('active');
        (_a = currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.querySelector('.card-options')) === null || _a === void 0 ? void 0 : _a.remove();
        currentPlayerPlaceholder = null;
        showAllPlayers();
        return;
    }
    if (this.classList.contains('blocked-position')) {
        return;
    }
    // Card already selected
    if (currentPlayerCard != null) {
        (_b = this.querySelector('.card-options')) === null || _b === void 0 ? void 0 : _b.remove();
        this.classList.add('player-card');
        currentPlayerCard.classList.remove('selected');
        // Switching Cards
        if (switchCards == true) {
            // Switch Content
            let cParent = currentPlayerCard.parentElement;
            let tParent = this.parentElement;
            let intermediate = (_c = currentPlayerCard.parentElement) === null || _c === void 0 ? void 0 : _c.className;
            cParent.className = (_d = this.parentElement) === null || _d === void 0 ? void 0 : _d.className;
            tParent.className = intermediate;
            (_e = currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.querySelector('.card-options')) === null || _e === void 0 ? void 0 : _e.remove();
            if (this.querySelector('.role')) {
                this.classList.remove('player-card');
            }
            currentPlayerPlaceholder = null;
            currentPlayerCard = null;
            updateLocalStorage();
            showAllPlayers();
            resetCards();
            switchCards = false;
            return;
        }
        else {
            this.innerHTML = currentPlayerCard.innerHTML;
            this.setAttribute('data-available', currentPlayerCard.getAttribute('data-position'));
            this.dataset.id = currentPlayerCard.dataset.id;
            updateLocalStorage();
            currentPlayerCard.classList.add('already-selected');
            this.classList.remove('active');
        }
        currentPlayerCard = null;
        hideRelevantPositions();
        return;
    }
    this.classList.add('active');
    currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.classList.remove('active');
    (_f = currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.querySelector('.card-options')) === null || _f === void 0 ? void 0 : _f.remove();
    currentPlayerPlaceholder = this;
    if (this.classList.contains('player-card')) {
        addOptions(this);
    }
    playersList.querySelectorAll('.player-card').forEach((item) => {
        var _a;
        const element = item;
        if (((_a = item.getAttribute('data-position')) === null || _a === void 0 ? void 0 : _a.search(position)) >= 0) {
            element.classList.remove('filtered');
            element.style.display = "";
        }
        else {
            element.classList.add('filtered');
            element.style.display = "none";
        }
    });
}
function addPlayerToStadium() {
    var _a;
    switchCards = false;
    if (currentPlayerPlaceholder != null) {
        try {
            (_a = [...playersList.querySelectorAll(`.player-name`)].filter(name => { var _a; return name.textContent == ((_a = currentPlayerPlaceholder.querySelector('.player-name')) === null || _a === void 0 ? void 0 : _a.textContent); })[0].closest('.player-card')) === null || _a === void 0 ? void 0 : _a.classList.remove('already-selected');
        }
        catch (_b) {
        }
        currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.classList.add('player-card');
        currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.classList.remove('active');
        currentPlayerPlaceholder.innerHTML = this.innerHTML;
        currentPlayerPlaceholder.setAttribute('data-available', this.getAttribute('data-position'));
        currentPlayerPlaceholder.dataset.id = this.dataset.id;
        updateLocalStorage();
        currentPlayerPlaceholder = null;
        this.classList.add('already-selected');
        showAllPlayers();
    }
    else if (!this.classList.contains('selected')) {
        currentPlayerCard === null || currentPlayerCard === void 0 ? void 0 : currentPlayerCard.classList.remove('selected');
        this.classList.add('selected');
        currentPlayerCard = this;
        showRelevantPositions();
    }
    else {
        this.classList.remove('selected');
        currentPlayerCard = null;
        hideRelevantPositions();
    }
}
function showAllPlayers() {
    playersList.querySelectorAll('.player-card').forEach((item) => {
        const element = item;
        element.classList.remove('filtered');
        element.style.display = "";
    });
}
function showRelevantPositions() {
    let position = currentPlayerCard === null || currentPlayerCard === void 0 ? void 0 : currentPlayerCard.getAttribute('data-position');
    selectedPlayersPlaceholders.forEach((item) => {
        let HTMLItem = item;
        if (position.search(item.getAttribute('data-position')) >= 0) {
            HTMLItem.classList.add('possible-position');
            HTMLItem.classList.remove('blocked-position');
        }
        else {
            HTMLItem.classList.remove('possible-position');
            HTMLItem.classList.add('blocked-position');
        }
    });
}
function hideRelevantPositions() {
    selectedPlayersPlaceholders.forEach((item) => {
        let HTMLItem = item;
        HTMLItem.classList.remove('possible-position');
        HTMLItem.classList.remove('blocked-position');
    });
}
//--------------------------------
// *** Search
//--------------------------------
let searchInput = document.getElementById('search');
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener('keyup', function () {
    playersList.querySelectorAll('.player-card').forEach((item) => {
        var _a;
        const element = item;
        if ((((_a = item.querySelector('.player-name')) === null || _a === void 0 ? void 0 : _a.textContent).toLocaleLowerCase().search(this.value.toLocaleLowerCase()) >= 0) && !element.classList.contains('filtered')) {
            element.style.display = "";
        }
        else {
            element.style.display = "none";
        }
    });
});
//---------------------------------
// *** Add Options
//---------------------------------
function removePlayerFromStadium(element) {
    var _a, _b;
    if (!element.querySelector('.role')) {
        let playerName = (_a = element.querySelector('.player-name')) === null || _a === void 0 ? void 0 : _a.textContent;
        (_b = [...playersList.querySelectorAll(`.player-name`)].filter(name => name.textContent == playerName)[0].closest('.player-card')) === null || _b === void 0 ? void 0 : _b.classList.remove('already-selected');
    }
    element.innerHTML =
        `<b class="role">${element.getAttribute('data-position')}</b>
        <span class="plus">+</span>`;
    element.setAttribute('data-available', "");
    element.setAttribute('data-id', "");
    element.classList.remove('player-card', 'active');
}
function addOptions(element) {
    let div = document.createElement('div');
    div.className = "card-options";
    let deleteButton = document.createElement('button');
    deleteButton.className = "delete-option";
    deleteButton.textContent = "X";
    div.append(deleteButton);
    deleteButton.addEventListener('click', function (e) {
        e.stopPropagation();
        removePlayerFromStadium(element);
        currentPlayerPlaceholder = null;
        updateLocalStorage();
        showAllPlayers();
    });
    let switchButton = document.createElement('button');
    switchButton.className = "switch-option";
    switchButton.innerHTML =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96l160 0 0 32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32l0 32L160 64C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96l-160 0 0-32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6l0-32 160 0c88.4 0 160-71.6 160-160z"/></svg>`;
    div.append(switchButton);
    switchButton.addEventListener('click', function (e) {
        e.stopPropagation();
        selectedPlayersPlaceholders.forEach(item => {
            var _a;
            let attr = item.getAttribute('data-position');
            if (element != item && ((_a = element.getAttribute('data-available')) === null || _a === void 0 ? void 0 : _a.search(attr)) >= 0) {
                item.classList.add('possible-position');
            }
            else {
                item.classList.add('blocked-position');
            }
            currentPlayerCard = element;
            switchCards = true;
        });
    });
    element.append(div);
}
let menu = document.getElementById('menu');
(_b = menu === null || menu === void 0 ? void 0 : menu.firstElementChild) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
    if (!menu.classList.contains('open')) {
        menu.classList.add('open');
        menu.classList.remove('closed', 'delayed');
    }
    else {
        let options = document.querySelector('.formation-options');
        let formationIcon = document.querySelector('.formation-icon');
        if (options.classList.contains("open")) {
            options.classList.remove('open');
            options.classList.add('closed');
            formationIcon.style.background = "";
            formationIcon.firstElementChild.style.fill = "";
            menu.classList.add('delayed');
        }
        menu.classList.remove('open');
        menu.classList.add('closed');
    }
});
(_c = menu.querySelector('.pen-icon')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
    inputs.forEach(item => {
        item.value = "";
    });
    modalModifyBtn.style.display = "none";
    modalModifyBtn.previousElementSibling.style.display = "block";
    modal.querySelector('h2').textContent = "Add New Player";
    modal.style.display = "flex";
});
(_d = menu.querySelector('.formation-icon')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function () {
    let options = document.querySelector('.formation-options');
    if (!options.classList.contains('open')) {
        options.classList.add('open');
        options.classList.remove('closed');
        this.style.backgroundColor = "#FFF";
        this.firstElementChild.style.fill = "#333";
    }
    else {
        options.classList.remove('open');
        options.classList.add('closed');
        this.style.backgroundColor = "";
        this.firstElementChild.style.fill = "";
    }
});
(_e = menu.querySelector('.trush-icon')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', function () {
    selectedPlayersPlaceholders.forEach(item => {
        removePlayerFromStadium(item);
    });
    createAlert('Update Saved', "The stadium has been successfully cleared");
    currentPlayerPlaceholder = null;
    updateLocalStorage();
    showAllPlayers();
});
//-----------------------------------------
// *** Update localStorage
//-----------------------------------------
function updateLocalStorage() {
    selectedPlayersPlaceholders.forEach((item, idx) => {
        let itemHTML = item;
        localStadium[idx] = +(itemHTML.dataset.id || "");
        localStadiumClasses[idx] = itemHTML.parentElement.className.replace("selected-player-container ", "");
    });
    localStorage.setItem('stadium', JSON.stringify(localStadium));
    localStorage.setItem('stadium-classes', JSON.stringify(localStadiumClasses));
    console.log(localStadiumClasses);
}
//-----------------------------------------
// *** Modal: Add players
//-----------------------------------------
let validRegExp = [
    /^[a-zA-Z][a-z A-Z]*$/,
    /^[1-5][0-9]$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[a-z ]+$/,
    /^[A-Z]+$/,
    /^[a-zA-Z 0-9]+$/,
    /\.(png|jpg|jpeg|webp)$/,
    /\.(png|jpg|jpeg|webp)$/,
];
(_f = modal === null || modal === void 0 ? void 0 : modal.querySelector('.close-btn')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', function () {
    modal.style.display = 'none';
});
(_g = modal.querySelector('.add-player')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', function () {
    let errors = false;
    for (let i = 0; i < inputs.length; i++) {
        let itemHTML = inputs[i];
        if (itemHTML.value.search(validRegExp[i]) >= 0) {
            itemHTML.style.borderColor = "";
        }
        else {
            itemHTML.style.borderColor = "red";
            errors = true;
        }
    }
    if (errors == true) {
        return;
    }
    const file = inputs[12].files[0];
    const file2 = inputs[13].files[0];
    if (file && file2) {
        const reader = new FileReader();
        const reader2 = new FileReader();
        reader2.onload = function () {
            let data = {
                id: localPlayersList[localPlayersList.length - 1].id + 1,
                name: inputs[0].value,
                age: +inputs[1].value,
                player_number: +inputs[2].value,
                Pace: +inputs[3].value,
                Shooting: +inputs[4].value,
                Passing: +inputs[5].value,
                Dribbling: +inputs[6].value,
                Defending: +inputs[7].value,
                Physical: +inputs[8].value,
                overall_rating: Math.round((+inputs[3].value
                    + +inputs[4].value
                    + +inputs[5].value
                    + +inputs[6].value
                    + +inputs[7].value
                    + +inputs[8].value) / 6),
                nationality: inputs[9].value,
                nation_icon: `https://www.countryflags.com/wp-content/uploads/${inputs[9].value}-flag-png-xl.png`,
                position: [inputs[10].value],
                league: inputs[11].value,
                club: "",
                player_image: reader.result,
                club_logo: reader2.result,
            };
            localPlayersList.push(data);
            localStorage.setItem('players', JSON.stringify(localPlayersList));
            createAlert('Added Player', `The player "${data.name}" was added`);
            addPlayerCard(data, false);
            modal.style.display = 'none';
        };
        reader.readAsDataURL(file);
        reader2.readAsDataURL(file2);
    }
});
inputs.forEach((item, index) => {
    let itemHTML = item;
    itemHTML.addEventListener('blur', function () {
        if (this.value.search(validRegExp[index]) >= 0) {
            this.style.borderColor = "";
        }
        else {
            this.style.borderColor = "red";
        }
    });
});
//-------------------------------
// *** Reset Cards
//-------------------------------
function resetCards() {
    selectedPlayersPlaceholders.forEach(item => {
        item.classList.remove('active', 'possible-position', 'blocked-position');
    });
}
//------------------------------------
// *** Formation
//------------------------------------
formationSelect.addEventListener('change', function () {
    let positions = this.value.split('-');
    selectedPlayersPlaceholders.forEach((card, index) => {
        var _a;
        let cardHTML = card.parentElement;
        cardHTML.className = "selected-player-container " + positions[index];
        if (((_a = card.getAttribute('data-available')) === null || _a === void 0 ? void 0 : _a.search(positions[index].replace(/[0-9]/, ""))) < 0 && !card.querySelector('.plus')) {
            card.classList.add('misplaced');
        }
        else {
            card.classList.remove('misplaced');
        }
        card.setAttribute('data-position', positions[index].replace(/[0-9]/, ""));
        if (!card.classList.contains('player-card')) {
            card.querySelector('.role').textContent = positions[index].replace(/[0-9]/, "");
        }
    });
    localStorage.setItem('formation', this.value);
    updateLocalStorage();
});
