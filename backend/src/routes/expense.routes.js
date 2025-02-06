const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

router.post('/', expenseController.create);
router.get('/', expenseController.getAll);
router.get('/insights', expenseController.getInsights);
router.get('/:id', expenseController.getById);
router.put('/:id', expenseController.update);
router.delete('/:id', expenseController.delete);

module.exports = router;
