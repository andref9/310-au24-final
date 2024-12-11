const thundy = new Move('thunder shock', 'electric', 40, 100);
const waterGun = new Move('water gun', 'water', 40, 100);

const pika = new Character('Pikachu', 37, [thundy], 'electric', 55, 40);
const squirt = new Character('Squirtle', 44, [waterGun], 'water', 48, 65);

describe('effectiveness tests', () => {
  it('is super effective', () => {
    expect(attack(thundy, pika, squirt)).toContain(`It's super effective!`);
  })
})