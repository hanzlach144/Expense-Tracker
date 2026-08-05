const db = require("../config/db");

function getExpenses(req, res) {

    const sql = `
    SELECT * FROM expenses
    WHERE userId = ?
    `;

    db.query(sql, [req.user.id], function (error, results) {

        if (error) {
            return res.status(500).json(error);
        }

        res.json(results);

    });

}

function addExpense(req, res) {

    const expense = req.body;

    const sql = `
    INSERT INTO expenses
    (name, amount, category, date, createdAt, month, userId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(

        sql,

        [

            expense.name,
            expense.amount,
            expense.category,
            expense.date,
            expense.createdAt,
            expense.month,
            req.user.id

        ],

        function (error) {

            if (error) {
                return res.status(500).json(error);
            }

            res.json({

                message: "Expense Added Successfully"

            });

        }

    );

}

function updateExpense(req, res) {

    const expense = req.body;

    const sql = `
    UPDATE expenses
    SET
        name = ?,
        amount = ?,
        category = ?,
        date = ?,
        month = ?
    WHERE createdAt = ?
    AND userId = ?
    `;

    db.query(

        sql,

        [

            expense.name,
            expense.amount,
            expense.category,
            expense.date,
            expense.month,
            expense.createdAt,
            req.user.id

        ],

        function (error) {

            if (error) {
                return res.status(500).json(error);
            }

            res.json({

                message: "Expense Updated Successfully"

            });

        }

    );

}

function deleteExpense(req, res) {

    const id = Number(req.params.id);

    const sql = `
    DELETE FROM expenses
    WHERE createdAt = ?
    AND userId = ?
    `;

    db.query(

        sql,

        [

            id,
            req.user.id

        ],

        function (error) {

            if (error) {
                return res.status(500).json(error);
            }

            res.json({

                message: "Expense Deleted Successfully"

            });

        }

    );

}

module.exports = {

    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense

};