import express from 'express';
import core from './core.js';

import { createHistoryEntry } from './models.js'

const router = express.Router();

router.get("/sub/:a/:b", async function (req, res) {
    const params = req.params;
    const a = Number(params.a);
    const b = Number(params.b);

    if (isNaN(a) || isNaN(b)) {
        res.status(400).send('Uno de los parámetros no es un número');
    } else {
        const result = core.sub(a, b);

        await createHistoryEntry({ firstArg: a, secondArg: b, operationName: "SUB", result: result })
        return res.send({ result });
    }
});


router.get("/pow/:a/:b", async function (req, res) {
    const params = req.params;
    const a = Number(params.a);
    const b = Number(params.b);

    if (isNaN(a) || isNaN(b)) {
        res.status(400).json({ error: 'Uno de los parámetros no es un número' });
    } else {
        const result = core.pow(a, b);
        await createHistoryEntry({ firstArg: a, secondArg: b, operationName: "POW", result: result });
        return res.send({ result })
    }
})

router.get("/div/:a/:b", async function (req, res) {
    const params = req.params;
    const a = Number(params.a);
    const b = Number(params.b);

    if (isNaN(a) || isNaN(b)) {
        const error = 'Uno de los parámetros no es un número';
        await createHistoryEntry({ firstArg: a, secondArg: b, operationName: "DIV", error });
        return res.status(400).send(error);
    } else if (b == 0) {
        const error = 'No se puede dividir entre 0';
        await createHistoryEntry({ firstArg: a, secondArg: b, operationName: "DIV", error });
        return res.status(400).json({ error });
    } else {
        const result = core.div(a, b);
        await createHistoryEntry({ firstArg: a, secondArg: b, operationName: "DIV", result });
        return res.send({ result });
    }
});

router.get("/add/:a/:b", async function (req, res) {
    const params = req.params;
    const a = Number(params.a);
    const b = Number(params.b);

    if (isNaN(a) || isNaN(b)) {
        const error = 'Uno de los parámetros no es un número';
        await createHistoryEntry({ firstArg: a, secondArg: b, operationName: "ADD", error })
        return res.status(400).send(error);
    } else {
        const result = core.add(a, b);

        await createHistoryEntry({ firstArg: a, secondArg: b, operationName: "ADD", result: result })
        return res.send({ result });
    }
});

router.get("/multiply/:a/:b", async function (req, res) {
    const params = req.params;
    const a = Number(params.a);
    const b = Number(params.b);

    if (isNaN(a) || isNaN(b)) {
        res.status(400).send('Uno de los parámetros no es un número');
    } else {
        const result = core.mul(a, b);

        await createHistoryEntry({ firstArg: a, secondArg: b, operationName: "MUL", result: result })
        return res.send({ result });
    }
});


export default router;