const body = document.querySelector('body');
const messageEl = document.getElementById('message-box');
const moveContainer = document.getElementById('move-container');
const themeButton = document.getElementById('theme-btn');
const npcBar = document.getElementById('npc-health-bar');
const playerBar = document.getElementById('player-health-bar');
const comment = document.getElementById('comment');
const select = document.getElementById('comment-type');
const errorComment = document.getElementById('comment-error');
const form = document.getElementById('the-form');

window.addEventListener('load', () => {
  if (localStorage['theme'] === undefined) {
    localStorage['theme'] = 'light';
  }
  if (localStorage['theme'] === 'dark') {
    body.classList.add('dark-theme');
  }
});

themeButton.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
  toggleStorageTheme();
});

/**
 * Toggle the dark theme save state
 */
function toggleStorageTheme() {
  if (localStorage['theme'] === 'light') {
    localStorage['theme'] = 'dark';
  } else {
    localStorage['theme'] = 'light';
  }
}

/**
 * I'm pretty sure this is redundant but like I always say it's better to be
 * safe than... whatever the opposite of safe is... yeah... I do say that
 */
function clearMessageBox() {
  messageEl.innerText = '';
}

function displayErr() {
  errorComment.classList.add('invalid');
  errorComment.innerText = `Invalid or missing input`;
}

function validLength(input, min) {
  if (input.value.trim().length >= min) {
    input.classList.remove('invalid');
    // errorComment.classList.remove('invalid');
    // errorComment.innerText = ``;
    return true;
  } else {
    input.classList.add('invalid');
    displayErr();
    return false;
  }
}

function validSelect(selector) {
  if (selector.value === 'choose') {
    selector.classList.add('invalid');
    displayErr();
    return false;
  } else {
    selector.classList.remove('invalid');
    // errorComment.classList.remove('invalid');
    // errorComment.innerText = ``;
    return true;
  }
}

/**
 * Form event listener
 */
form.addEventListener('submit', (e) => {
  let selected = validSelect(select);
  let longEnough = validLength(comment, 3);
  if (!(selected)) {
    e.preventDefault();
  } else if (!longEnough) {
    e.preventDefault();
  } else {
    alert(`That went straight into the void LOL`);
  }
})

/**
 * Display message for game start
 */
function startMessage() {
  const msg = `${npc.name} is here to ruin your day!\n\nYou sent out ${player.name}`;
  messageEl.innerText = msg;
}

/**
 * Take a list of messages and a tracker and display the messages to the user
 * one after the other
 * @param {Array} messages A list of messages to display
 * @param {Object} tracker Has a "stutter" for timing the message order
 */
function displayMessages(messages, tracker) {
  for (let i = 0; i < messages.length; i++) {
    setTimeout(() => {
      clearMessageBox();
      messageEl.innerText = messages[i];
    }, tracker.stutter * 3000);
    tracker.stutter++;
  }
}

function displayNames() {
  const npcName = document.createElement('span');
  npcName.innerText = npc.name;
  npcBar.parentElement.insertBefore(npcName, npcBar);
  const playerName = document.createElement('span');
  playerName.innerText = player.name;
  playerBar.parentElement.insertBefore(playerName, playerBar);
}

function makeMoveButton(move) {
  const moveButton = document.createElement('button');
  moveButton.classList.add('move-button');
  moveButton.id = move.name.replace(' ', '-');
  moveButton.innerText = move.name;
  moveButton.addEventListener('click', (e) => {
    handleChoice(e);
  });
  return moveButton;
}

function makeMoves() {
  for (let move of player.moves) {
    const btn = makeMoveButton(move);
    moveContainer.appendChild(btn);
  }
}

function toggleButtons(tracker=null) {
  let time = tracker === null ? 0 : tracker.stutter * 3000;
  setTimeout(() => {
    for (let btn of moveContainer.children) {
      if (btn.hasAttribute('disabled')) {
        btn.removeAttribute('disabled');
      } else {
        btn.setAttribute('disabled', true);
      }
    }
  }, time);
}

function colorHealthBar(healthEl, percentage) {
  if (percentage < 75 && percentage > 25) {
    healthEl.style.backgroundColor = 'orange';
  } else if (percentage <= 25) {
    healthEl.style.backgroundColor = 'red';
  }
}

/**
 * Take a player and update its health bar
 * @param {Character} player The player whose health bar will be updated
 * @param {object} tracker Has a "stutter" for timing
 */
function updateHealthBar(player, tracker=null) {
  const stutter = tracker === null ? 0 : tracker.stutter * 3000;
  let percentage = Math.round((player.getHealth() / player.maxHealth) * 100);
  if (percentage < 0) {
    percentage = 0;
  }
  const healthBar = player.getType() === 'npc' ? npcBar : playerBar;
  setTimeout(() => {
    healthBar.style.width = `${percentage}%`;
    colorHealthBar(healthBar, percentage);
  }, stutter);
}

function handleChoice(e) {
  toggleButtons();
  // use tracker object to time messages properly
  const tracker = {stutter: 1};
  // take target id and translate to move name
  let moveName = e.target.id.replace('-', ' ');
  // use move name to find index in moveMap
  let index = player.moveMap[moveName];
  // call attack with move (Don't forget to catch the messages)
  let messages = attack(player.moves[index], player, npc);
  updateHealthBar(npc);
  // check if game is over
  if (gameover(player, npc)) {
    messages.push(`${npc.name} fainted!`);
    displayMessages(messages, tracker);
    return;
  }
  //display messages from attack
  displayMessages(messages, tracker);
  // get npc choice and call attack
  let npcChoice = npc.getMoveChoice();
  messages = attack(npcChoice, npc, player);
  updateHealthBar(player, tracker);
  // check if game is over
  if (gameover(player, npc)) {
    messages.push(`${player.name} fainted!`);
    displayMessages(messages, tracker);
    return;
  }
  // display messages
  displayMessages(messages, tracker);
  toggleButtons(tracker);
}

// Main:
displayNames();
makeMoves();
startMessage();