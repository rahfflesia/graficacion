import fs from "node:fs/promises";

async function generarPrincipiosDeIngenieria(ruta) {
  try {
    const contenido = `Principios de Ingeniería

1. DRY (Don't Repeat Yourself)

Objetivo
Mantener una única fuente de verdad para lógica, reglas y conocimiento del sistema.

Reglas
- Evita duplicar lógica de negocio.
- Reutiliza funciones y componentes existentes antes de crear nuevos.
- Si una lógica aparece más de dos veces, extráela a una función o módulo reutilizable.
- Centraliza constantes, configuraciones y validaciones compartidas.

Anti-patrones
- Copiar y pegar lógica entre servicios.
- Duplicar validaciones en múltiples capas.
- Mantener múltiples implementaciones para la misma regla de negocio.


2. KISS (Keep It Simple, Stupid)

Objetivo
Mantener el sistema simple, legible y fácil de mantener.

Reglas
- Prefiere soluciones simples sobre abstracciones complejas.
- Escribe código fácil de leer y entender.
- Mantén funciones pequeñas y cohesivas.
- Reduce anidaciones y complejidad innecesaria.

Anti-patrones
- Sobreingeniería.
- Uso innecesario de patrones de diseño.
- Abstracciones prematuras.


3. YAGNI (You Aren't Gonna Need It)

Objetivo
Implementar únicamente lo que es necesario actualmente.

Reglas
- No agregues funcionalidades especulativas.
- Implementa extensiones solo cuando exista una necesidad real.
- Evita crear puntos de extensión innecesarios.

Anti-patrones
- Código preparado para escenarios hipotéticos.
- Configuraciones innecesarias.
- APIs excesivamente genéricas.


4. Modularidad

Objetivo
Dividir el sistema en componentes independientes y reutilizables.

Reglas
- Cada módulo debe tener una responsabilidad clara.
- Minimiza el acoplamiento entre módulos.
- Maximiza la cohesión interna.
- Mantén interfaces claras entre componentes.

Anti-patrones
- Dependencias circulares.
- Módulos monolíticos.
- Componentes con múltiples responsabilidades.


5. Abstracción

Objetivo
Ocultar detalles de implementación y exponer únicamente lo necesario.

Reglas
- Expón interfaces simples y claras.
- Encapsula complejidad interna.
- Mantén separadas las reglas de negocio de la infraestructura.

Anti-patrones
- Exponer detalles internos innecesarios.
- Filtrar lógica técnica hacia capas de negocio.
- Interfaces excesivamente complejas.


6. Encapsulamiento

Objetivo
Proteger el estado y comportamiento interno de los componentes.

Reglas
- Controla el acceso a datos internos.
- Evita modificaciones externas directas al estado.
- Expón únicamente operaciones necesarias.

Anti-patrones
- Estado mutable compartido.
- Acceso directo a propiedades internas.
- Dependencias globales ocultas.


7. SOLID

Single Responsibility Principle (SRP)
- Cada módulo o clase debe tener una única responsabilidad clara.
- Una clase debe tener una sola razón para cambiar.

Open/Closed Principle (OCP)
- El sistema debe permitir extensión sin modificar código estable.
- Prefiere composición y polimorfismo sobre modificaciones directas.

Liskov Substitution Principle (LSP)
- Las implementaciones deben poder sustituir sus abstracciones sin romper comportamiento esperado.

Interface Segregation Principle (ISP)
- Prefiere interfaces pequeñas y específicas.
- Los clientes no deben depender de métodos que no utilizan.

Dependency Inversion Principle (DIP)
- Depende de abstracciones, no de implementaciones concretas.
- Los módulos de alto nivel no deben depender directamente de módulos de bajo nivel.

Anti-patrones
- Clases gigantes.
- Interfaces monolíticas.
- Acoplamiento fuerte entre capas.
- Herencia profunda innecesaria.


Restricciones Generales

- No introducir complejidad innecesaria.
- No crear abstracciones sin una necesidad clara.
- No reescribir código estable sin justificación.
- Prefiere composición sobre herencia.
- Prefiere código explícito sobre comportamiento mágico.
- Evita funciones excesivamente largas.
- Evita dependencias globales.`;
    await fs.writeFile(`${ruta}/principios_ingenieria.txt`, contenido);
  } catch (error) {
    console.error("Error al crear el archivo", error);
  }
}

async function generarAntipatrones(ruta) {
  try {
    const contenido = `Antipatrones Prohibidos

- Clases dios

- Controladores con lógica de negocio

- Utility classes gigantes

- Dependencias circulares

- Herencia profunda innecesaria

- Abstracciones prematuras

- Código preparado para escenarios hipotéticos

- Estado global mutable

- Duplicación de lógica

- Funciones excesivamente largas

- Acoplamiento fuerte entre módulos

- Comentarios redundantes que expliquen código obvio.

- Uso innecesario de patrones de diseño

- Métodos con demasiadas responsabilidades`;
    await fs.writeFile(`${ruta}/antipatrones.txt`, contenido);
  } catch (error) {
    console.error("Error al crear el archivo", error);
  }
}

async function generarFlujoTrabajoDesarrollo(ruta) {
  try {
    const contenido = ` Flujo de trabajo

- Analizar requerimientos

- Revisar contexto y arquitectura

- Revisar módulos existentes reutilizables

- Diseñar solución simple

- Implementar tests

- Implementar funcionalidad

- Ejecutar tests

- Ejecutar linting

- Revisar arquitectura

- Revisar duplicación

- Refactorizar si es necesario

- Finalizar implementación

Definition of done:

- El código compila

- Todos los tests pasan

- No hay warnings

- Se respetan principios de ingeniería

- Se respetan reglas arquitectónicas

- No existe duplicación innecesaria

- El código es legible y mantenible

- El manejo de errores es correcto

Test driven development (TDD)

- Escribir pruebas antes del código cuando sea posible

- Garantizar cobertura de casos principales

- Garantizar cobertura de errores esperados

- Garantizar cobertura de edge cases principales u obvios

- No intentar una cobertura del 100%, las pruebas tienen que ser suficientemente buenas no perfectas

Refactorización

- Refactorizar únicamente cuando aporte claridad, mantenibilidad o exista un patrón lo suficientemente obvio o repetido que merezca ser convertido en abstracción

- No refactorizar código estable sin razón clara`;
    await fs.writeFile(`${ruta}/flujo_trabajo.txt`, contenido);
  } catch (error) {
    console.error("Error al crear el archivo", error);
  }
}

async function generarInstruccionesAgente(ruta) {
  try {
    const contenido = `Lee en el siguiente orden los archivos del proyecto

1. Instrucciones para el agente

2. Contexto del proyecto

3. Principios de ingeniería

4. Arquitectura

5. Convenciones técnicas

6. Diagramas

7. Antipatrones

8. Flujo de trabajo

Leer los documentos en ese órden te permitirá entender mejor el contexto del proyecto.

Recuerda seguir al pie de la letra lo especificado en cada archivo y si en algún momento existe ambiguedad elige consistencia sobre creatividad
`;
    await fs.writeFile(`${ruta}/instrucciones_agente.txt`, contenido);
  } catch (error) {
    console.error("Error al crear el archivo", error);
  }
}

async function generarConvencionesTecnicas(ruta) {
  try {
    const contenido = `Convenciones Técnicas

Objetivo:
Mantener consistencia técnica, calidad de código, mantenibilidad y estabilidad en todo el sistema.

Lenguaje y Configuración

- Utilizar tipado estricto cuando el lenguaje lo permita.
- Evitar configuraciones ambiguas o implícitas.
- Mantener consistencia en versiones y dependencias.

Estructura del Proyecto

- Mantener separación clara entre capas y módulos.
- Agrupar archivos por responsabilidad y dominio.
- Evitar carpetas genéricas sin propósito claro.
- Mantener nombres descriptivos y consistentes.

Naming Conventions

- Utilizar nombres descriptivos.
- Evitar abreviaciones innecesarias.
- Variables deben expresar intención.
- Funciones deben describir acciones.
- Clases deben representar conceptos del dominio.
- Interfaces deben representar contratos claros.

Evitar:
- data
- manager
- helper
- utils
- temp
- misc

Manejo de Errores

- Nunca ignorar errores silenciosamente.
- Utilizar mensajes descriptivos.
- Validar entradas externas.
- No exponer detalles internos al usuario.
- Manejar errores en los límites del sistema.

Evitar:
- catch vacíos
- console.log como manejo de errores
- errores genéricos sin contexto

Comentarios

- Escribir código autoexplicativo.
- Utilizar comentarios solo cuando aporten contexto útil.
- Explicar el porqué, no el qué.
- Mantener comentarios actualizados.

Logging

- Utilizar logs estructurados.
- Registrar eventos relevantes.
- No registrar información sensible.
- Mantener logs claros y útiles para debugging.

Seguridad

- Validar toda entrada externa.
- Nunca confiar en datos del cliente.
- Sanitizar datos cuando sea necesario.
- Utilizar consultas parametrizadas.
- Evitar hardcodear secretos o credenciales.

Dependencias

- Minimizar dependencias externas.
- Evitar librerías innecesarias.
- Preferir soluciones nativas cuando sea razonable.
- No introducir frameworks nuevos sin justificación.

Performance

- Priorizar claridad antes que microoptimizaciones.
- Optimizar únicamente cuando exista evidencia real.
- Evitar trabajo innecesario.
- Evitar consultas redundantes.

Consistencia

- Mantener consistencia con patrones existentes.
- Reutilizar implementaciones existentes antes de crear nuevas.
- Respetar arquitectura y convenciones del proyecto.

`;
    await fs.writeFile(`${ruta}/convenciones_tecnicas.txt`, contenido);
  } catch (error) {
    console.error(
      "Error al generar el archivo de convenciones técnicas",
      error,
    );
  }
}

async function generarArquitectura(ruta) {
  try {
    const contenido = `Arquitectura: cliente-servidor

Utiliza una arquitectura cliente servidor, el frontend solo debe de encargarse de la presentación y consume endpoints, no implementes lógica de negocio compleja aquí ni dupliques lógica, 
el backend se encarga de la lógica de negocio, ambos se van a comunicar mediante una API REST utilizando HTTP. Deben de utilizarse interfaces tipadas/DTOs.
`;
    await fs.writeFile(`${ruta}/arquitectura.txt`, contenido);
  } catch (error) {
    console.error("Error al generar el archivo de arquitectura");
  }
}

async function generarTechStack(ruta) {
  try {
    const contenido = `Tech stack a utilizar:

Frontend:
- React + TS (Últimas versiones)
- Para hacer peticiones utiliza APIs nativas del navegador (fetch y promesas)
- Utiliza react router para las rutas de la aplicación
- Para manejo del estado global utiliza la API por defecto de React (Context API) o si consideras que la app es lo suficientemente grande puedes utilizar Redux
- Estilos: CSS Modules
- Builder: Vite

Backend:
- Node.js + Express.js (Últimas versiones)
- Base de datos: MySQL
- ORM: Prisma

Auth:
- JWT + Bcrypt para hashing

Testing:
- Vitest + React Testing Library
`;
    await fs.writeFile(`${ruta}/tech_stack.txt`, contenido);
  } catch (error) {
    console.error("Error al generar el archivo de tech stack", error);
  }
}

async function generarDiseño(ruta) {
  try {
    const contenido = `Diseño

- Utiliza principalmente blanco y negro así como distintos tonos de rosa y morado para acentuar

- Implementa modo oscuro e invierte los colores a sus equivalente utiliza HSL para que sea más fácil

- Tipografía: Poppins

- Prioriza mobile first

- Utiliza transiciones y animaciones sutiles, recuerda priorizar el rendimiento por lo que es mejor si utilizas transform cuando sea posible

- Prioriza una interfaz moderna y minimalista

- Utiliza prácticas modernas de CSS como CSS variables y manten márgenes y espaciados consistentes en la aplicación, para esto puedes crear variables de tamaño sm, md, bg`;
    await fs.writeFile(`${ruta}/diseño.txt`, contenido);
  } catch (error) {
    console.error("Error al generar el archivo de diseño", error);
  }
}

async function generarArchivos(ruta) {
  await generarAntipatrones(ruta);
  await generarConvencionesTecnicas(ruta);
  await generarFlujoTrabajoDesarrollo(ruta);
  await generarInstruccionesAgente(ruta);
  await generarPrincipiosDeIngenieria(ruta);
  await generarArquitectura(ruta);
  await generarTechStack(ruta);
  await generarDiseño(ruta);
}

export default generarArchivos;
