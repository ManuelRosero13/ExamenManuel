export type Rol = 'titular' | 'reserva' | 'banca'

export function normalizarRol(rol: unknown): Rol {
  if (rol === 'titular' || rol === 'reserva' || rol === 'banca') return rol
  if (rol === 'suplente') return 'banca'
  return 'reserva'
}

export const ETIQUETA_ROL: Record<Rol, string> = {
  titular: 'Titular',
  reserva: 'Reserva',
  banca: 'En la banca',
}

export interface PokemonResumen {
  id: number
  nombre: string
}

export interface PokemonDetalle {
  id: number
  nombre: string
  sprite: string | null
  tipos: string[]
  altura: number
  peso: number
}

export interface MiembroEquipo {
  id: string
  pokemonId: number
  nombre: string
  sprite: string | null
  tipos: string[]
  rol: Rol
  apodo: string
}

export interface UsuarioActual {
  uid: string
  email: string
}

export type EstadoPeticion<T> =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'exito'; datos: T }

export type RootStackParamList = {
  Login: undefined
  Tabs: undefined
  Detalle: { nombre: string }
}

export type TabsParamList = {
  Explorar: undefined
  Equipo: undefined
}
