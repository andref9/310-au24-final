class Character {
  constructor(name, maxHealth, moves, type) {
    this.name = name;
    this.maxHealth = maxHealth;
    this.moves = moves;
    this.type = type;
    this.currHealth = maxHealth;
  }

  getHealth() {
    return this.currHealth;
  }

  setHealth(health) {
    this.currHealth = health;
  }
}

class Npc extends Character {
  constructor(name, maxHealth, moves, type) {
    super(name, maxHealth, moves, type);
  }

  getMoveChoice() {
    const index = Math.floor(Math.random() * this.moves.length);
    return this.moves[index];
  }
}