import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Lista de stakeholders' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Stakeholder creado' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Stakeholder actualizado' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Stakeholder eliminado' });
});

export default router;
