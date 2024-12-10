class Character {
  constructor(name, maxHealth, moves, type, atk, def) {
    this.name = name;
    this.maxHealth = maxHealth;
    this.moveMap = {};
    this.moves = moves;
    for (let i = 0; i < moves.length; i++) {
      let moveName = moves[i].name;
      this.moveMap[moveName] = i;
    }
    this.type = type;
    this.atk = atk;
    this.def = def;
    this.currHealth = maxHealth;
  }

  getHealth() {
    return this.currHealth;
  }

  setHealth(health) {
    this.currHealth = health;
  }

  getType() {
    return 'character';
  }
}

class Npc extends Character {
  constructor(name, maxHealth, moves, type, atk, def) {
    super(name, maxHealth, moves, type, atk, def);
  }

  getMoveChoice() {
    const index = Math.floor(Math.random() * this.moves.length);
    return this.moves[index];
  }

  getType() {
    return 'npc';
  }
}

class Move {
  constructor(name, type, power, acc) {
    this.name = name;
    this.type = type;
    this.power = power;
    this.acc = acc;
  }
}

// Map types to their weaknesses
const weak = {
  electric: ['ground'],
  fire: ['ground', 'rock', 'water'],
  grass: ['bug', 'fire'],
  water: ['electric', 'grass'],
  normal: ['fighting']
}

/**
 * Take two players and determines if the game is over if either player's
 * health is zero or less
 * @param {Character} player1 player one
 * @param {Character} player2 player two
 * @returns true if either player reaches zero health points false otherwise
 */
function gameover(player1, player2) {
  if (player1.getHealth() <= 0 || player2.getHealth() <= 0) {
    return true;
  }
  return false;
}

/**
 * Determine the critical hit modifier
 * @returns The critical hit modifier
 */
function getCrit() {
  let roll = Math.floor(Math.random() * 100);
  if (roll < 10) {
    return 2;
  } else {
    return 1;
  }
}

/**
 * Take a move and use its accuracy score to determine if the move hits or
 * misses
 * @param {Move} move The move
 * @returns Whether or not the move hits (true/false)
 */
function hits(move) {
  let roll = Math.floor(Math.random() * 100);
  if (roll < move.acc) {
    return true;
  } else {
    return false;
  }
}

function attack(move, attacker, target) {
  const messages = [];

  messages.push(`${attacker.name} used ${move.name}`);

  // check if attack hits or misses
  if (!hits(move)) {
    messages.push('The attack missed!')
    return messages;
  }
  // critical hit modifier will be 1 or 2
  const crit = getCrit();
  if (crit === 2) {
    messages.push('Critical hit!');
  }

  // type modifier will be 0.5, 1, or 2
  let type = 1;

  if (weak[target.type].includes(move.type)) {
    type = 2;
  } else if (weak[move.type].includes(target.type)) {
    type = 0.5;
  }

  switch (type) {
    case 0.5:
      messages.push(`It's not very effective`);
      break;
    case 1:
      break;
    case 2:
      messages.push(`It's super effective!`);
      break;
  }
  // calculate
  let critMod = ((20 * crit) / 5) + 2;
  let numerator = (attacker.atk / target.def) * critMod * move.power;
  let denominator = 50;
  let damage = (numerator / denominator) * type;
  damage = Math.round(damage);
  // do damage to target
  messages.push(`The attack did ${damage} damage!`);
  target.setHealth(target.getHealth() - damage);
  // return attack effect messages
  return messages;
}

const pikaMoves = [
  new Move('quick attack', 'normal', 40, 100),
  new Move('thunder shock', 'electric', 40, 100),
  new Move('thunderbolt', 'electric', 90, 100)
];

const player = new Character('Pikachu', 37, pikaMoves, 'electric', 55, 40);

const npcMoves = [
  new Move('scratch', 'normal', 40, 100),
  new Move('ember', 'fire', 40, 100),
  new Move('dragon breath', 'fire', 60, 100)
];

const npc = new Npc('Charmander', 39, npcMoves, 'fire', 52, 43);