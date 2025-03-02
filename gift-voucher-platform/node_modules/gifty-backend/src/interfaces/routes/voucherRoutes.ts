import express from 'express';

const router = express.Router();

// GET all vouchers
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all vouchers - endpoint to be implemented' });
});

// GET voucher by ID
router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get voucher with ID: ${req.params.id} - endpoint to be implemented` });
});

// POST create new voucher
router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create new voucher - endpoint to be implemented', data: req.body });
});

// PUT update voucher
router.put('/:id', (req, res) => {
  res.status(200).json({ message: `Update voucher with ID: ${req.params.id} - endpoint to be implemented`, data: req.body });
});

// DELETE voucher
router.delete('/:id', (req, res) => {
  res.status(200).json({ message: `Delete voucher with ID: ${req.params.id} - endpoint to be implemented` });
});

export { router as voucherRoutes }; 