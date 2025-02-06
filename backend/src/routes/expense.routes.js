const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

router.post('/',authMiddleware, expenseController.create);
router.get('/',authMiddleware, expenseController.getAll);
router.get('/insights', authMiddleware, expenseController.getInsights);
router.get('/:id', expenseController.getById);
router.put('/:id', expenseController.update);
router.delete('/:id',authMiddleware, expenseController.delete);

module.exports = router;
