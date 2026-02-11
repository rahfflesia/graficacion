import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Lista de roles' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Rol creado' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Rol actualizado' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Rol eliminado' });
});

export default router;
