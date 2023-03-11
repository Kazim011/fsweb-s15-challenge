/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("bilmeceler").truncate();
  await knex("bilmeceler").insert([
    {
      bilmece: "Bir kamyonu kim tek eliyle durdurabilir?",
    },
    {
      bilmece: "Yürür iz etmez, hızlansa toz etmez",
    },
    {
      bilmece: "Dört ayağı olsa da adım atamaz",
    },
  ]);
};
