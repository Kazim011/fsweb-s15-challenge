const superTest = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");
const jwtDecode = require("jwt-decode");
const bcrypt = require("bcryptjs");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db.seed.run();
});
afterAll(async () => {
  await db.destroy();
});

// testleri buraya yazın
test("[0] Testler çalışır durumda]", () => {
  expect(true).toBe(true);
});

describe("Server Test", () => {
  it("[1] Server çalışıyor mu", async () => {
    const res = await superTest(server).get("/");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Server Çalışıyor");
  });
});

describe("[POST] /api/auth/login", () => {
  it("[1] geçerli kriterlerde doğru mesajı döndürüyor", async () => {
    const res = await superTest(server)
      .post("/api/auth/login")
      .send({ username: "bob", password: "1234" });
    expect(res.body.message).toMatch("Welcome bob");
  }, 750);

  it("[2] kriterler geçersizse doğru mesaj ve durum kodu", async () => {
    let res = await superTest(server)
      .post("/api/auth/login")
      .send({ username: "bobsy", password: "1234" });
    expect(res.body.message).toMatch("Geçersiz kriterler");
    expect(res.status).toBe(401);
  }, 750);
  it("[3] doğru token ve { username, exp, iat } ile yanıtlıyor", async () => {
    let res = await superTest(server)
      .post("/api/auth/login")
      .send({ username: "bob", password: "1234" });
    let decoded = jwtDecode(res.body.token);
    expect(decoded).toHaveProperty("iat");
    expect(decoded).toHaveProperty("exp");
    expect(decoded).toMatchObject({
      username: "bob",
    });
    res = await superTest(server)
      .post("/api/auth/login")
      .send({ username: "sue", password: "1234" });
    decoded = jwtDecode(res.body.token);
    expect(decoded).toHaveProperty("iat");
    expect(decoded).toHaveProperty("exp");
    expect(decoded).toMatchObject({
      username: "sue",
    });
  }, 750);
});

describe("[POST] /api/auth/register", () => {
  it("[4] veritabanına yeni kullanıcı kaydı", async () => {
    await superTest(server)
      .post("/api/auth/register")
      .send({ username: "kazim", password: "1234" });
    const kazim = await db("users").where("username", "kazim").first();
    expect(kazim).toMatchObject({ username: "kazim" });
  }, 750);
  it("[8] şifre düz metin yerine kriptolu bir şekilde kaydediliyor", async () => {
    await superTest(server)
      .post("/api/auth/register")
      .send({ username: "kazim", password: "1234" });
    const kazim = await db("users").where("username", "kazim").first();
    expect(bcrypt.compareSync("1234", kazim.password)).toBeTruthy();
  }, 750);
});

describe("[GET] /api/bilmeceler", () => {
  it("[17] token göndermeden denenirse doğru mesaj", async () => {
    const res = await superTest(server).get("/api/bilmeceler");
    expect(res.body.message).toMatch("token gereklidir");
  }, 750);
  it("[18] geçersiz token girilirse doğru mesaj", async () => {
    const res = await superTest(server)
      .get("/api/bilmeceler")
      .set("Authorization", "ddd");
    expect(res.body.message).toMatch("token geçersizdir");
  }, 750);
  it("[19] token geçerliyse bilmeceler geliyor", async () => {
    let res = await superTest(server)
      .post("/api/auth/login")
      .send({ username: "bob", password: "1234" });
    res = await superTest(server)
      .get("/api/bilmeceler")
      .set("Authorization", res.body.token);
    expect(res.body).toMatchObject([
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
  }, 750);
});
