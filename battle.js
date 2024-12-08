const body = document.querySelector('body');
const messageEl = document.getElementById('message-box');
const moveContainer = document.getElementById('move-container');
const themeButton = document.getElementById('theme-btn');

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

function toggleStorageTheme() {
  if (localStorage['theme'] === 'light') {
    localStorage['theme'] = 'dark';
  } else {
    localStorage['theme'] = 'light';
  }
}

function clearMessageBox() {
  messageEl.innerText = '';
}

/**
 * Take a list of messages and a tracker and display the messages to the user
 * one after the other
 * @param {Array} messages A list of messages to display
 * @param {Object} tracker Has a "timestamp" for timing the message order
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

function handleChoice(e) {
  // use tracker object to time messages properly
  const tracker = {stutter: 1};
  // take target id and translate to move name
  let moveName = e.target.id.replace('-', ' ');
  // use move name to find index in moveMap
  let index = player.moveMap[moveName];
  // call attack with move (Don't forget to catch the messages)
  let messages = attack(player.moves[index], player, npc);
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
  // check if game is over
  if (gameover(player, npc)) {
    messages.push(`${player.name} fainted!`);
  }
  // display messages
  displayMessages(messages, tracker);
}

// Main:
makeMoves();