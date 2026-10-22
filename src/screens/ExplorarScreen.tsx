
import { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { obtenerLista } from '../services/pokeService'
import { useEquipo } from '../context/EquipoContext'
import type {
  EstadoPeticion,
  PokemonResumen,
  RootStackParamList,
} from '../types'
import { C } from '../tema'

export default function ExplorarScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const { salir } = useEquipo()

  const [estado, setEstado] = useState<EstadoPeticion<PokemonResumen[]>>({
    tipo: 'cargando',
  })
  const [busqueda, setBusqueda] = useState('')

  const cargarPokemon = async () => {
    setEstado({ tipo: 'cargando' })

    try {
      const datos = await obtenerLista()
      setEstado({ tipo: 'exito', datos })
    } catch {
      setEstado({
        tipo: 'error',
        mensaje:
          'No se pudieron cargar los Pokémon. Revisa tu conexión e inténtalo de nuevo.',
      })
    }
  }

  useEffect(() => {
    cargarPokemon()
  }, [])

  const visibles =
    estado.tipo === 'exito'
      ? estado.datos.filter((pokemon) =>
          pokemon.nombre.includes(busqueda.trim().toLowerCase()),
        )
      : []

  return (
    <View style={estilos.pantalla}>
      <View style={estilos.encabezado}>
        <Text style={estilos.titulo}>Explorar</Text>
        <Pressable onPress={salir} style={estilos.salir}>
          <Text style={estilos.textoSalir}>Salir</Text>
        </Pressable>
      </View>

      <TextInput
        style={estilos.buscador}
        placeholder="Buscar por nombre..."
        placeholderTextColor={C.suave}
        value={busqueda}
        onChangeText={setBusqueda}
        autoCapitalize="none"
      />

      <View style={{ flex: 1 }}>
        {estado.tipo === 'cargando' && (
          <View style={estilos.centro}>
            <ActivityIndicator size="large" color={C.acento} />
            <Text style={estilos.textoCarga}>Cargando Pokémon...</Text>
          </View>
        )}

        {estado.tipo === 'error' && (
          <View style={estilos.centro}>
            <Text style={estilos.error}>{estado.mensaje}</Text>
            <Pressable
              style={estilos.botonReintentar}
              onPress={cargarPokemon}
            >
              <Text style={estilos.textoReintentar}>Reintentar</Text>
            </Pressable>
          </View>
        )}

        {estado.tipo === 'exito' && (
          <FlatList
            data={visibles}
            keyExtractor={(pokemon) => pokemon.nombre}
            contentContainerStyle={{ padding: 16, gap: 10 }}
            ListEmptyComponent={
              <Text style={estilos.vacio}>
                Ningún Pokémon coincide con la búsqueda.
              </Text>
            }
            renderItem={({ item }) => (
              <Pressable
                style={estilos.fila}
                onPress={() =>
                  navigation.navigate('Detalle', { nombre: item.nombre })
                }
              >
                <Text style={estilos.numero}>#{item.id}</Text>
                <Text style={estilos.nombre}>{item.nombre}</Text>
              </Pressable>
            )}
          />
        )}
      </View>
    </View>
  )
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: C.fondo },
  encabezado: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: { color: C.texto, fontSize: 24, fontWeight: '800' },
  salir: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  textoSalir: { color: C.acento, fontWeight: '700' },
  buscador: {
    marginHorizontal: 16,
    backgroundColor: C.tarjeta,
    borderWidth: 1,
    borderColor: C.borde,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: C.texto,
  },
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding: 24,
  },
  textoCarga: { color: C.suave },
  error: { color: C.error, textAlign: 'center' },
  botonReintentar: {
    borderWidth: 1.5,
    borderColor: C.acento,
    borderRadius: 10,
    minHeight: 44,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  textoReintentar: { color: C.acento, fontWeight: '700' },
  vacio: { color: C.suave, textAlign: 'center', marginTop: 30 },
  fila: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    backgroundColor: C.tarjeta,
    borderRadius: 10,
    padding: 14,
    minHeight: 52,
  },
  numero: { color: C.suave, width: 44 },
  nombre: {
    color: C.texto,
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
})
