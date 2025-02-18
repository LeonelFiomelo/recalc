const { seed } = require('../src/seed.js')
const {
    createHistoryEntry,
    History,
    Operation,
    deleteAllHistory,
    getHistory
} = require('../src/models.js')

beforeEach(async () => {
    await seed()
})

describe("History", () => {

    test("Deberia poder crear una resta en el history", async () => {
        await createHistoryEntry({
            firstArg: 2,
            secondArg: 2,
            result: 0,
            error: null,
            operationName: "SUB"
        })

        const histories = await History.findAll({
            include: [Operation]
        })

        expect(histories.length).toEqual(1)
        expect(histories[0].firstArg).toEqual(2)
        expect(histories[0].secondArg).toEqual(2)
        expect(histories[0].result).toEqual(0)
        expect(histories[0].error).toBeNull()
        expect(histories[0].Operation.name).toEqual("SUB")

    })

    test("Debería poder crear una multiplicación en el history", async () => {
        await createHistoryEntry({
            firstArg: 5,
            secondArg: 5,
            result: 25,
            error: null,
            operationName: "MUL"
        })

        const histories = await History.findAll({
            include: [Operation]
        })

        expect(histories.length).toEqual(1)
        expect(histories[0].firstArg).toEqual(5)
        expect(histories[0].secondArg).toEqual(5)
        expect(histories[0].result).toEqual(25)
        expect(histories[0].error).toBeNull()
        expect(histories[0].Operation.name).toEqual("MUL")
    })

    test("Debería poder crear una división en el history", async () => {
        await createHistoryEntry({
            firstArg: 10,
            secondArg: 2,
            result: 5,
            error: null,
            operationName: "DIV"
        })

        const histories = await History.findAll({
            include: [Operation]
        })

        expect(histories.length).toEqual(1)
        expect(histories[0].firstArg).toEqual(10)
        expect(histories[0].secondArg).toEqual(2)
        expect(histories[0].result).toEqual(5)
        expect(histories[0].error).toBeNull()
        expect(histories[0].Operation.name).toEqual("DIV")
    })

    test("Debería poder guardar información de error en el history", async () => {
        const entry = {
            firstArg: 5,
            secondArg: 0,
            result: null,
            operationName: "DIV",
            error: "División por cero"
        };

        await createHistoryEntry(entry);

        const histories = await History.findAll({
            include: [Operation]
        });

        expect(histories.length).toEqual(1);
        expect(histories[0].firstArg).toEqual(5);
        expect(histories[0].result).toBeNull();
        expect(histories[0].Operation.name).toEqual("DIV");
        expect(histories[0].error).toEqual("División por cero");
    })
  
    test("Debería poder guardar información de error en el history de la division", async () => {
        const entry = {
            firstArg: 5,
            secondArg: "a",
            result: null,
            operationName: "DIV",
            error: "Uno de los parámetros no es un número"
        };

        await createHistoryEntry(entry);

        const histories = await History.findAll({
            include: [Operation]
        });

        expect(histories.length).toEqual(1);
        expect(histories[0].firstArg).toEqual(5);
        expect(histories[0].secondArg).toEqual("a");
        expect(histories[0].result).toBeNull();
        expect(histories[0].Operation.name).toEqual("DIV");
        expect(histories[0].error).toEqual("Uno de los parámetros no es un número");
    })
  
    test("Debería poder guardar la información del error en el history de la suma", async () => {
        const entry = {
            firstArg: 6,
            secondArg: "a",
            result: null,
            operationName: "ADD",
            error: "Uno de los parámetros no es un número"
        };

        await createHistoryEntry(entry);

        const histories = await History.findAll({
            include: [Operation]
        });

        expect(histories.length).toEqual(1);
        expect(histories[0].firstArg).toEqual(6);
        expect(histories[0].secondArg).toEqual("a");
        expect(histories[0].result).toBeNull();
        expect(histories[0].Operation.name).toEqual("ADD");
        expect(histories[0].error).toEqual("Uno de los parámetros no es un número");
      })

    test("Debería obtener todo el historial desde la base de datos", async () => {
        const historyEntry1 = {
            firstArg: 2,
            secondArg: 2,
            result: 0,
            operationName: "SUB",
            error: null,
        };
        const historyEntry2 = {
            firstArg: 5,
            secondArg: 0,
            result: null,
            operationName: "DIV",
            error: "División por cero",
        };

        await createHistoryEntry(historyEntry1);
        await createHistoryEntry(historyEntry2);

        const history = await getHistory();

        expect(history.length).toEqual(2);
        expect(history[0].firstArg).toEqual(historyEntry1.firstArg);
        expect(history[0].result).toEqual(historyEntry1.result);
        expect(history[0].error).toEqual(historyEntry1.error);
        expect(history[0].Operation.name).toEqual(historyEntry1.operationName);
        expect(history[1].firstArg).toEqual(historyEntry2.firstArg);
        expect(history[1].result).toEqual(historyEntry2.result);
        expect(history[1].error).toEqual(historyEntry2.error);
        expect(history[1].Operation.name).toEqual(historyEntry2.operationName);
    });

    test("Debería poder eliminar todo el historial", async () => {
        await createHistoryEntry({
            firstArg: 5,
            secondArg: 5,
            result: 25,
            error: null,
            operationName: "MUL"
        })
        await createHistoryEntry({
            firstArg: 10,
            secondArg: 2,
            result: 5,
            error: null,
            operationName: "DIV"
        })
        await deleteAllHistory();
        const histories = await History.findAll();
        expect(histories.length).toEqual(0);
    });

})
