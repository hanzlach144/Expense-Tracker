const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const expenseController = require("../controllers/expenseController");

router.get("/expenses", authMiddleware, expenseController.getExpenses);

router.post("/expenses", authMiddleware, expenseController.addExpense);

router.put("/expenses/:id", authMiddleware, expenseController.updateExpense);

router.delete("/expenses/:id", authMiddleware, expenseController.deleteExpense);

module.exports = router;