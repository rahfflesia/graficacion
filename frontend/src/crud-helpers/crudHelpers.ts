import { WritableSignal } from '@angular/core';

function crear(signal: WritableSignal<any[]>, valor: any) {
  signal.update((arr) => [valor, ...arr]);
}

function editar(signal: WritableSignal<any[]>, objetoEditado: any, propiedad: any) {
  signal().map((elemento, index) => {
    console.log(elemento);
    if (elemento[propiedad] === objetoEditado[propiedad]) {
      signal()[index] = objetoEditado;
      return;
    }
    console.error('No se encontró ningún objeto que coincidiera');
    return;
  });
}

function eliminar(signal: WritableSignal<any[]>, objetoEliminado: any, propiedad: string) {
  signal.update((arr) =>
    arr.filter((elemento) => elemento[propiedad] !== objetoEliminado[propiedad]),
  );
}

export { crear, editar, eliminar };
