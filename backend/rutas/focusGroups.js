const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

router.post('/crear', async (req, res) => {
  const { idsubproceso, nombre, descripcion, idmoderador, lugar, fechahora, temas, participantes } = req.body;
  try {
    const nuevoFocusGroup = await prisma.$transaction(async (tx) => {
      const focusGroup = await tx.focusgroups.create({
        data: {
          idsubproceso,
          nombre,
          descripcion,
          idmoderador,
          lugar,
          ...(fechahora && { fechahora: new Date(fechahora) }),
        },
      });

      if (temas && temas.length > 0) {
        await tx.temasfocusgroup.createMany({
          data: temas.map((tema) => ({
            idfocusgroup: focusGroup.idfocusgroup,
            tema,
          })),
        });
      }

      if (participantes && participantes.length > 0) {
        await tx.participantesfg.createMany({
          data: participantes.map((idpersona) => ({
            idfocusgroup: focusGroup.idfocusgroup,
            idpersona,
          })),
        });
      }

      return await tx.focusgroups.findUnique({
        where: { idfocusgroup: focusGroup.idfocusgroup },
        include: {
          temasfocusgroup: true,
          participantesfg: { include: { personas: true } },
          personas: true,
        },
      });
    });

    res.status(201).json(nuevoFocusGroup);
  } catch (error) {
    console.error('Error al crear Focus Group:', error);
    res.status(500).json({ error: 'Hubo un error al crear el Focus Group' });
  }
});

router.get('/obtener/:idsubproceso', async (req, res) => {
  const { idsubproceso } = req.params;
  try {
    const focusGroups = await prisma.focusgroups.findMany({
      where: { idsubproceso: parseInt(idsubproceso) },
      include: {
        temasfocusgroup: true,
        participantesfg: { include: { personas: true } },
        personas: true,
      },
      orderBy: { fechahora: 'desc' },
    });
    res.status(200).json(focusGroups);
  } catch (error) {
    console.error('Error al obtener Focus Groups:', error);
    res.status(500).json({ error: 'Hubo un error al obtener los Focus Groups' });
  }
});

router.delete('/eliminar/:idfocusgroup', async (req, res) => {
  const { idfocusgroup } = req.params;
  try {
    await prisma.focusgroups.delete({
      where: { idfocusgroup: parseInt(idfocusgroup) },
    });
    res.status(200).json({ mensaje: 'Focus Group eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar Focus Group:', error);
    res.status(500).json({ error: 'Hubo un error al eliminar el Focus Group' });
  }
});

router.put('/editar/:idfocusgroup', async (req, res) => {
  const { idfocusgroup } = req.params;
  const { nombre, descripcion, idmoderador, lugar, fechahora, temas, participantes } = req.body;

  try {
    const fgEditado = await prisma.$transaction(async (tx) => {
      const focusGroup = await tx.focusgroups.update({
        where: { idfocusgroup: parseInt(idfocusgroup) },
        data: {
          nombre,
          descripcion,
          idmoderador,
          lugar,
          ...(fechahora && { fechahora: new Date(fechahora) }),
        },
      });

      await tx.temasfocusgroup.deleteMany({
        where: { idfocusgroup: parseInt(idfocusgroup) },
      });
      if (temas && temas.length > 0) {
        await tx.temasfocusgroup.createMany({
          data: temas.map((tema) => ({
            idfocusgroup: parseInt(idfocusgroup),
            tema,
          })),
        });
      }

      await tx.participantesfg.deleteMany({
        where: { idfocusgroup: parseInt(idfocusgroup) },
      });
      if (participantes && participantes.length > 0) {
        await tx.participantesfg.createMany({
          data: participantes.map((idpersona) => ({
            idfocusgroup: parseInt(idfocusgroup),
            idpersona,
          })),
        });
      }

      return await tx.focusgroups.findUnique({
        where: { idfocusgroup: focusGroup.idfocusgroup },
        include: {
          temasfocusgroup: true,
          participantesfg: { include: { personas: true } },
          personas: true,
        },
      });
    });

    res.status(200).json(fgEditado);
  } catch (error) {
    console.error('Error al editar Focus Group:', error);
    res.status(500).json({ error: 'Hubo un error al editar el Focus Group' });
  }
});

module.exports = router;
