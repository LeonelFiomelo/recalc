import { Sequelize, DataTypes } from 'sequelize';

const inTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: !inTest,
    storage: inTest ? './db.sqlite3' : './db.sqlite3'
})

export const History = sequelize.define('History', {
    firstArg: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    secondArg: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    result: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    error: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

export const Operation = sequelize.define('Operation', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

Operation.hasMany(History)
History.belongsTo(Operation)

export async function createHistoryEntry({ firstArg, secondArg, operationName, result, error }) {
    const operation = await Operation.findOne({
        where: {
            name: operationName
        }
    });

    return History.create({
        firstArg,
        secondArg,
        result,
        error,
        OperationId: operation.id
    })
}

export function createTables() {
    return Promise.all([
        History.sync({ force: true }),
        Operation.sync({ force: true })
    ]);
}

export async function getHistory() {
    return History.findAll({
      include: [Operation],
    });
  }

export async function deleteAllHistory() {
    try {
      await History.destroy({ truncate: true });
      console.log('Se eliminó todo el historial exitosamente.');
    } catch (error) {
      console.error('Error al eliminar el historial:', error);
    }
  }