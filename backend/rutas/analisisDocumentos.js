const express = require('express');
const router = express.Router();
const prisma = require('../prisma');

router.post('/crear', async (req, res) => {
  const { idsubproceso, nombre, descripcion, idanalista, tipodocumento, fuente, fechaanalisis, notas, hallazgos } = req.body;
  try {
    const nuevoAnalisis = await prisma.$transaction(async (tx) => {
      const analisis = await tx.analisisDocumentos.create({
        data: {
          idsubproceso,
          nombre,
          descripcion,
          idanalista,
          tipodocumento,
          fuente,
          notas,
          ...(fechaanalisis && { fechaanalisis: new Date(fechaanalisis) }),
        },
      });

      if (hallazgos && hallazgos.length > 0) {
        await tx.hallazgosanalisis.createMany({
          data: hallazgos.map((hallazgo) => ({
            idanalisis: analisis.idanalisis,
            hallazgo,
          })),
        });
      }

      return await tx.analisisDocumentos.findUnique({
        where: { idanalisis: analisis.idanalisis },
        include: {
          hallazgosanalisis: true,
          personas: true,
        },
      });
    });

    res.status(201).json(nuevoAnalisis);
  } catch (error) {
    console.error('Error al crear Análisis de Documento:', error);
    res.status(500).json({ error: 'Hubo un error al crear el Análisis de Documento' });
  }
});

router.get('/obtener/:idsubproceso', async (req, res) => {
  const { idsubproceso } = req.params;
  try {
    const analisis = await prisma.analisisDocumentos.findMany({
      where: { idsubproceso: parseInt(idsubproceso) },
      include: {
        hallazgosanalisis: true,
        personas: true,
      },
      orderBy: { fechaanalisis: 'desc' },
    });
    res.status(200).json(analisis);
  } catch (error) {
    console.error('Error al obtener Análisis de Documentos:', error);
    res.status(500).json({ error: 'Hubo un error al obtener los Análisis de Documentos' });
  }
});

router.delete('/eliminar/:idanalisis', async (req, res) => {
  const { idanalisis } = req.params;
  try {
    await prisma.analisisDocumentos.delete({
      where: { idanalisis: parseInt(idanalisis) },
    });
    res.status(200).json({ mensaje: 'Análisis de Documento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar Análisis de Documento:', error);
    res.status(500).json({ error: 'Hubo un error al eliminar el Análisis de Documento' });
  }
});

router.put('/editar/:idanalisis', async (req, res) => {
  const { idanalisis } = req.params;
  const { nombre, descripcion, idanalista, tipodocumento, fuente, fechaanalisis, notas, hallazgos } = req.body;

  try {
    const analisisEditado = await prisma.$transaction(async (tx) => {
      const analisis = await tx.analisisDocumentos.update({
        where: { idanalisis: parseInt(idanalisis) },
        data: {
          nombre,
          descripcion,
          idanalista,
          tipodocumento,
          fuente,
          notas,
          ...(fechaanalisis && { fechaanalisis: new Date(fechaanalisis) }),
        },
      });

      await tx.hallazgosanalisis.deleteMany({
        where: { idanalisis: parseInt(idanalisis) },
      });
      if (hallazgos && hallazgos.length > 0) {
        await tx.hallazgosanalisis.createMany({
          data: hallazgos.map((hallazgo) => ({
            idanalisis: parseInt(idanalisis),
            hallazgo,
          })),
        });
      }

      return await tx.analisisDocumentos.findUnique({
        where: { idanalisis: analisis.idanalisis },
        include: {
          hallazgosanalisis: true,
          personas: true,
        },
      });
    });

    res.status(200).json(analisisEditado);
  } catch (error) {
    console.error('Error al editar Análisis de Documento:', error);
    res.status(500).json({ error: 'Hubo un error al editar el Análisis de Documento' });
  }
});

module.exports = router;
