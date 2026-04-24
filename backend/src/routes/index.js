'use strict';

const { Router } = require('express');
const authRoutes = require('./authRoutes');
const aiRoutes = require('./aiRoutes');

const router = Router();

// ─── Health Check ─────────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── Mount Feature Routers ────────────────────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/ai', aiRoutes);

module.exports = router;
