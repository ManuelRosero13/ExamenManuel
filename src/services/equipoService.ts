import { db } from '../firebase/config'
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { normalizarRol } from '../types'
import type { MiembroEquipo, PokemonDetalle, Rol } from '../types'

// Ruta de datos:  usuarios/{uid}/equipo/{pokemonId}
function coleccionEquipo(uid: string) {
  return collection(db, 'usuarios', uid, 'equipo')
}

export async function obtenerEquipo(uid: string): Promise<MiembroEquipo[]> {
  const snap = await getDocs(coleccionEquipo(uid))
  return snap.docs
    .map((d) => {
      const datos = d.data() as Omit<MiembroEquipo, 'id'>
      return {
        id: d.id,
        ...datos,
        pokemonId: datos.pokemonId ?? Number(d.id),
        rol: normalizarRol(datos.rol),
      }
    })
    .sort((a, b) => a.pokemonId - b.pokemonId)
}

export async function agregarMiembro(uid: string, pokemon: PokemonDetalle): Promise<MiembroEquipo> {
  const id = String(pokemon.id)
  const datos: Omit<MiembroEquipo, 'id'> = {
    pokemonId: pokemon.id,
    nombre: pokemon.nombre,
    sprite: pokemon.sprite,
    tipos: pokemon.tipos,
    rol: 'reserva',
    apodo: '',
  }
  await setDoc(doc(db, 'usuarios', uid, 'equipo', id), { ...datos, agregadoEn: serverTimestamp() })
  return { id, ...datos }
}

export async function actualizarRol(uid: string, id: string, rol: Rol): Promise<void> {
  await updateDoc(doc(db, 'usuarios', uid, 'equipo', id), { rol })
}

export async function quitarMiembro(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, 'usuarios', uid, 'equipo', id))
}

// Datos de ejemplo para no empezar con el equipo vacío.
export async function sembrarEquipo(uid: string): Promise<void> {
  const ejemplo: Array<Omit<MiembroEquipo, 'id'>> = [
    { pokemonId: 25, nombre: 'pikachu', sprite: null, tipos: ['electric'], rol: 'titular', apodo: '' },
    { pokemonId: 1, nombre: 'bulbasaur', sprite: null, tipos: ['grass', 'poison'], rol: 'reserva', apodo: '' },
    { pokemonId: 4, nombre: 'charmander', sprite: null, tipos: ['fire'], rol: 'banca', apodo: '' },
  ]
  for (const m of ejemplo) {
    await setDoc(doc(db, 'usuarios', uid, 'equipo', String(m.pokemonId)), { ...m, agregadoEn: serverTimestamp() })
  }
}
