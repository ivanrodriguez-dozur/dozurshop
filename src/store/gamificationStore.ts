import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { supabase } from '@/lib/supabaseClient'

interface GamificationState {
  // Usuario
  user: {
    id: string | null
    name: string
    avatar?: string
    bio?: string
    email?: string
    phone?: string
    coverPhoto?: string
    totalXp: number
    totalCoins: number
    level: number
    dailyStreak: number
    lastActivity: string
    rank: string
    isAuthenticated: boolean
  }
  
  // Estado de carga
  isLoading: boolean
  
  // Notificaciones
  notification: {
    show: boolean
    xp: number
    message: string
  }
  
  // Acciones de autenticación
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  
  // Acciones de perfil
  updateProfile: (updates: Partial<GamificationState['user']>) => Promise<{ success: boolean; error?: string }>
  uploadCoverPhoto: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>
  uploadProfilePhoto: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>
  
  // Acciones existentes
  initializeUser: (userId: string) => Promise<void>
  loadUserData: () => Promise<void>
  addXp: (amount: number, action: string) => Promise<void>
  spendCoins: (amount: number, item: string) => Promise<boolean>
  updateDailyStreak: () => Promise<void>
  hideNotification: () => void
  
  // Utilidades
  getXpForNextLevel: () => number
  getMultiplier: () => number
  getRankInfo: () => { name: string; color: string; icon: string }
}

const XP_PER_LEVEL = 1000
const RANKS = {
  'Novato': { min: 0, max: 500, color: 'gray', icon: '🔰' },
  'Explorador': { min: 500, max: 1500, color: 'green', icon: '🗺️' },
  'Aventurero': { min: 1500, max: 3000, color: 'blue', icon: '⚔️' },
  'Maestro': { min: 3000, max: 6000, color: 'purple', icon: '🎖️' },
  'Leyenda': { min: 6000, max: Infinity, color: 'gold', icon: '👑' }
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      user: {
        id: null,
        name: 'Usuario',
        avatar: undefined,
        bio: 'Escribe algo sobre ti...',
        email: undefined,
        phone: undefined,
        coverPhoto: undefined,
        totalXp: 0,
        totalCoins: 100, // Coins iniciales
        level: 1,
        dailyStreak: 0,
        lastActivity: new Date().toISOString().split('T')[0],
        rank: 'Novato',
        isAuthenticated: false
      },
      
      isLoading: false,
      
      notification: {
        show: false,
        xp: 0,
        message: ''
      },
      
      initializeUser: async (userId: string) => {
        set({ isLoading: true })
        
        try {
          // Verificar si el usuario ya existe
          const { data: existingUser, error } = await supabase
            .from('user_points')
            .select('*')
            .eq('user_id', userId)
            .single()
          
          if (existingUser) {
            // Usuario existente, cargar datos
            const rank = Object.keys(RANKS).find(rankName => 
              existingUser.total_xp >= RANKS[rankName].min && 
              existingUser.total_xp < RANKS[rankName].max
            ) || 'Novato'
            
            set({
              user: {
                id: userId,
                name: existingUser.name || 'Usuario',
                avatar: existingUser.avatar,
                bio: existingUser.bio || 'Escribe algo sobre ti...',
                email: existingUser.email,
                phone: existingUser.phone,
                coverPhoto: existingUser.cover_photo,
                totalXp: existingUser.total_xp,
                totalCoins: existingUser.total_coins,
                level: Math.floor(existingUser.total_xp / XP_PER_LEVEL) + 1,
                dailyStreak: existingUser.daily_streak,
                lastActivity: existingUser.last_activity,
                rank,
                isAuthenticated: true
              }
            })
          } else {
            // Usuario nuevo, crear registro
            const { error: insertError } = await supabase
              .from('user_points')
              .insert({
                user_id: userId,
                total_xp: 0,
                total_coins: 100,
                daily_streak: 0,
                last_activity: new Date().toISOString().split('T')[0]
              })
            
            if (!insertError) {
              set({
                user: {
                  id: userId,
                  name: 'Usuario',
                  avatar: undefined,
                  bio: 'Escribe algo sobre ti...',
                  email: undefined,
                  phone: undefined,
                  coverPhoto: undefined,
                  totalXp: 0,
                  totalCoins: 100,
                  level: 1,
                  dailyStreak: 0,
                  lastActivity: new Date().toISOString().split('T')[0],
                  rank: 'Novato',
                  isAuthenticated: true
                }
              })
              
              // Registrar bono por registro
              await get().addXp(100, 'Registro completado')
            }
          }
        } catch (error) {
          console.error('Error initializing user:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      loadUserData: async () => {
        try {
          set({ isLoading: true })
          console.log('Ejecutando loadUserData...')
          
          // Obtener usuario autenticado
          const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
          
          if (authError || !authUser) {
            console.log('No hay usuario autenticado:', authError)
            set({ 
              isLoading: false,
              user: {
                ...get().user,
                isAuthenticated: false
              }
            })
            return
          }
          
          console.log('Usuario autenticado encontrado:', authUser.id)
          
          // Obtener datos del perfil desde la tabla users
          const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single()
          
          if (profileError) {
            console.error('Error obteniendo perfil:', profileError)
            set({ isLoading: false })
            return
          }
          
          console.log('Perfil de usuario obtenido:', userProfile)
          
          // Obtener datos de gamificación desde user_profiles
          const { data: gamificationProfile, error: gamificationError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', authUser.id)
            .single()
          
          if (gamificationError) {
            console.error('Error obteniendo perfil de gamificación:', gamificationError)
            set({ isLoading: false })
            return
          }
          
          console.log('Perfil de gamificación obtenido:', gamificationProfile)
          
          // Actualizar estado
          const newUserState = {
            id: authUser.id,
            name: userProfile.name || 'Usuario',
            avatar: userProfile.avatar_url,
            bio: userProfile.bio || 'Escribe algo sobre ti...',
            email: userProfile.email,
            phone: userProfile.phone,
            coverPhoto: userProfile.cover_photo,
            totalXp: gamificationProfile.total_xp || 0,
            totalCoins: gamificationProfile.total_coins || 0,
            level: gamificationProfile.level || 1,
            dailyStreak: 0, // Esto se puede calcular desde user_activities
            lastActivity: new Date().toISOString().split('T')[0],
            rank: gamificationProfile.rank || 'Bronze',
            isAuthenticated: true
          }
          
          console.log('Estableciendo nuevo estado del usuario:', newUserState)
          
          set({
            user: newUserState,
            isLoading: false
          })
          
        } catch (error) {
          console.error('Error en loadUserData:', error)
          set({ isLoading: false })
        }
      },
      
      addXp: async (amount: number, action: string) => {
        const { user } = get()
        if (!user.id) return
        
        try {
          const finalXp = amount
          const coinsEarned = Math.floor(finalXp / 10) // 10 XP = 1 coin
          
          // Usar la función SQL para agregar XP
          const { error } = await supabase.rpc('add_user_xp', {
            p_user_id: user.id,
            p_xp: finalXp,
            p_coins: coinsEarned,
            p_description: action
          })
          
          if (error) {
            console.error('Error agregando XP:', error)
            return
          }
          
          // Recargar datos del usuario para obtener el nivel actualizado
          await get().loadUserData()
          
          // Mostrar notificación
          set({
            notification: {
              show: true,
              xp: finalXp,
              message: action
            }
          })
          
          // Ocultar notificación después de 3 segundos
          setTimeout(() => {
            get().hideNotification()
          }, 3000)
          
        } catch (error) {
          console.error('Error en addXp:', error)
        }
      },
      
      hideNotification: () => {
        set({
          notification: {
            show: false,
            xp: 0,
            message: ''
          }
        })
      },
      
      spendCoins: async (amount: number, item: string) => {
        const { user } = get()
        if (!user.id || user.totalCoins < amount) return false
        
        const newTotal = user.totalCoins - amount
        
        // Actualizar estado local
        set({
          user: {
            ...user,
            totalCoins: newTotal
          }
        })
        
        // Actualizar en Supabase
        await supabase
          .from('user_points')
          .update({ total_coins: newTotal })
          .eq('user_id', user.id)
        
        // Registrar transacción
        await supabase
          .from('point_transactions')
          .insert({
            user_id: user.id,
            action_type: 'purchase',
            xp_earned: 0,
            coins_earned: -amount,
            description: `Compra: ${item}`
          })
        
        return true
      },
      
      updateDailyStreak: async () => {
        const { user } = get()
        if (!user.id) return
        
        const today = new Date().toISOString().split('T')[0]
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
        
        let newStreak = user.dailyStreak
        
        if (user.lastActivity === yesterday) {
          // Continuó la racha
          newStreak += 1
        } else if (user.lastActivity !== today) {
          // Rompió la racha
          newStreak = 1
        }
        
        // Actualizar estado
        set({
          user: {
            ...user,
            dailyStreak: newStreak,
            lastActivity: today
          }
        })
        
        // Actualizar en Supabase
        await supabase
          .from('user_points')
          .update({
            daily_streak: newStreak,
            last_activity: today
          })
          .eq('user_id', user.id)
        
        // Dar bonus por racha
        if (newStreak > 1) {
          await get().addXp(10 + (newStreak * 2), `Racha diaria: ${newStreak} días`)
        }
      },
      
      getXpForNextLevel: () => {
        const { user } = get()
        const currentLevelXp = (user.level - 1) * XP_PER_LEVEL
        return XP_PER_LEVEL - (user.totalXp - currentLevelXp)
      },
      
      getMultiplier: () => {
        const { user } = get()
        const rankMultipliers = {
          'Novato': 1,
          'Explorador': 1.2,
          'Aventurero': 1.5,
          'Maestro': 1.8,
          'Leyenda': 2.0
        }
        return rankMultipliers[user.rank] || 1
      },
      
      getRankInfo: () => {
        const { user } = get()
        const rankInfo = RANKS[user.rank] || RANKS['Novato']
        return {
          name: user.rank,
          color: rankInfo.color,
          icon: rankInfo.icon
        }
      },
      
      // Funciones de autenticación
      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          console.log('Iniciando signIn con:', email)
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          })
          
          if (error) {
            console.error('Error en auth.signInWithPassword:', error)
            throw error
          }
          
          console.log('Auth exitoso, data.user:', data.user)
          
          if (data.user) {
            // Actualizar last_login en la tabla users
            await supabase
              .from('users')
              .update({ last_login: new Date().toISOString() })
              .eq('id', data.user.id)
            
            console.log('Cargando datos del usuario...')
            // Cargar datos del usuario desde las nuevas tablas
            await get().loadUserData()
            
            console.log('Estado después de loadUserData:', get().user)
            
            // Verificar logros de primer inicio
            setTimeout(async () => {
              const { data: activities } = await supabase
                .from('user_activities')
                .select('*')
                .eq('user_id', data.user.id)
                .eq('activity_type', 'login')
              
              if (!activities || activities.length === 0) {
                // Es el primer login, otorgar logro
                await supabase.rpc('add_user_xp', {
                  p_user_id: data.user.id,
                  p_xp: 100,
                  p_coins: 50,
                  p_description: 'Primer inicio de sesión'
                })
                
                get().addXp(100, 'Primer inicio de sesión')
              }
            }, 1000)
            
            return { success: true }
          }
          
          return { success: false, error: 'Error de autenticación' }
        } catch (error: any) {
          console.error('Error en signIn:', error)
          return { success: false, error: error.message || 'Error de autenticación' }
        } finally {
          set({ isLoading: false })
        }
      },
      
      signUp: async (email: string, password: string, name: string) => {
        try {
          set({ isLoading: true })
          console.log('Iniciando signUp con:', email, name)
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { name }
            }
          })
          
          if (error) {
            console.error('Error en auth.signUp:', error)
            throw error
          }
          
          console.log('SignUp exitoso, data.user:', data.user)
          console.log('¿Usuario necesita confirmación?', !data.session)
          
          if (data.user) {
            // Solo crear perfil si el usuario está confirmado o si no requiere confirmación
            if (data.session || !data.user.email_confirmed_at) {
              console.log('Creando perfil en tabla users...')
              const { error: profileError } = await supabase
                .from('users')
                .insert({
                  id: data.user.id,
                  email: data.user.email,
                  name: name,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
              
              if (profileError) {
                console.error('Error creando perfil:', profileError)
                // Si el error es que ya existe, no es problema
                if (!profileError.message.includes('duplicate') && !profileError.message.includes('already exists')) {
                  throw profileError
                }
              } else {
                console.log('Perfil creado exitosamente')
              }
            }
            
            // Si hay una sesión activa, cargar datos inmediatamente
            if (data.session) {
              console.log('Sesión activa detectada, cargando datos...')
              await new Promise(resolve => setTimeout(resolve, 1000)) // Esperar a que el trigger cree el perfil
              await get().loadUserData()
              console.log('Estado después de loadUserData en signUp:', get().user)
            }
            
            return { 
              success: true, 
              message: data.session ? 'Cuenta creada e iniciada' : 'Cuenta creada, revisa tu email para confirmar'
            }
          }
          
          return { success: false, error: 'Error al crear cuenta' }
        } catch (error: any) {
          console.error('Error en signUp:', error)
          return { success: false, error: error.message || 'Error al crear cuenta' }
        } finally {
          set({ isLoading: false })
        }
      },
      
      signOut: async () => {
        try {
          console.log('Ejecutando signOut...')
          await supabase.auth.signOut()
          
          console.log('SignOut exitoso, reseteando estado...')
          set({
            user: {
              id: null,
              name: 'Usuario',
              avatar: undefined,
              bio: 'Escribe algo sobre ti...',
              email: undefined,
              phone: undefined,
              coverPhoto: undefined,
              totalXp: 0,
              totalCoins: 100,
              level: 1,
              dailyStreak: 0,
              lastActivity: new Date().toISOString().split('T')[0],
              rank: 'Novato',
              isAuthenticated: false
            }
          })
          
          console.log('Estado después de signOut:', get().user)
        } catch (error) {
          console.error('Error al cerrar sesión:', error)
        }
      },
      
      // Funciones de actualización de perfil
      updateProfile: async (updates: Partial<GamificationState['user']>) => {
        const { user } = get()
        if (!user.id) return { success: false, error: 'Usuario no autenticado' }
        
        try {
          const { error } = await supabase
            .from('users')
            .update({
              name: updates.name,
              bio: updates.bio,
              avatar_url: updates.avatar,
              phone: updates.phone,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id)
          
          if (error) throw error
          
          set(state => ({
            user: { ...state.user, ...updates }
          }))
          
          return { success: true }
        } catch (error) {
          return { success: false, error: error.message || 'Error al actualizar perfil' }
        }
      },
      
      uploadCoverPhoto: async (file: File) => {
        const { user } = get()
        if (!user.id) return { success: false, error: 'Usuario no autenticado' }
        
        try {
          const fileName = `cover-${user.id}-${Date.now()}.${file.name.split('.').pop()}`
          const { data, error } = await supabase.storage
            .from('user-uploads')
            .upload(`covers/${fileName}`, file)
          
          if (error) throw error
          
          const { data: { publicUrl } } = supabase.storage
            .from('user-uploads')
            .getPublicUrl(`covers/${fileName}`)
          
          await get().updateProfile({ coverPhoto: publicUrl })
          
          return { success: true, url: publicUrl }
        } catch (error) {
          return { success: false, error: error.message || 'Error al subir imagen' }
        }
      },
      
      uploadProfilePhoto: async (file: File) => {
        const { user } = get()
        if (!user.id) return { success: false, error: 'Usuario no autenticado' }
        
        try {
          const fileName = `avatar-${user.id}-${Date.now()}.${file.name.split('.').pop()}`
          const { data, error } = await supabase.storage
            .from('user-uploads')
            .upload(`avatars/${fileName}`, file)
          
          if (error) throw error
          
          const { data: { publicUrl } } = supabase.storage
            .from('user-uploads')
            .getPublicUrl(`avatars/${fileName}`)
          
          await get().updateProfile({ avatar: publicUrl })
          
          return { success: true, url: publicUrl }
        } catch (error) {
          return { success: false, error: error.message || 'Error al subir imagen' }
        }
      }
    }),
    {
      name: 'gamification-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
)
