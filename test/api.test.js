const request = require('supertest');
const api = require('../src/api.js');
const { seed } = require('../src/seed.js')

beforeEach(async () => {
    await seed()
})

describe("API substract", () => {
    test("Debería responder con un 200 OK", async () => {
        const app = await api.build();

        return request(app)
            .get('/api/v1/sub/2/1')
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")
            .then((res) => {
                expect(res.body.result).toEqual(1);
            });
    });
});

describe("API add", () => {
    test("Debería responder con un 200 OK", async () => {
        const app = await api.build();

        return request(app)
            .get('/api/v1/add/5/-3')
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")
            .then((res) => {
                expect(res.body.result).toBeLessThan(5);
            });
    });
});

describe("API multiply", () => {
    test("Debería responder con un 200 OK y el resultado debe contener decimal", async () => {
        const app = await api.build();

        return request(app)
            .get('/api/v1/multiply/2.5/1.5')
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")
            .then((res) => {
                expect(res.body.result).toEqual(3.75);
                expect(res.body.result % 1 !== 0).toBeTruthy();
            });
    });
});

describe("API divide", () => {
    test("Debería responder con un 400 Bad Request y un mensaje de error cuando el segundo parámetro es 0", async () => {
        const app = await api.build();

        return request(app)
            .get('/api/v1/div/2/0')
            .expect(400)
            .expect('Content-Type', "application/json; charset=utf-8")
            .then((res) => {
                expect(res.body.error).toEqual("No se puede dividir entre 0")
            });
    });
})