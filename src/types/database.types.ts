// Fase 1, Tarea 1.10: Tipos TypeScript generados desde el schema de Supabase
// NOTA: Regenerar con `npx supabase gen types typescript --project-id <ID>` una vez configurado Supabase

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      perfiles_usuario: {
        Row: {
          id: string
          nombre_completo: string
          rol: Database["public"]["Enums"]["rol_usuario"]
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nombre_completo: string
          rol?: Database["public"]["Enums"]["rol_usuario"]
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre_completo?: string
          rol?: Database["public"]["Enums"]["rol_usuario"]
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      clientes: {
        Row: {
          id: string
          razon_social: string
          rfc: string
          contacto_nombre: string | null
          contacto_tel: string | null
          contacto_email: string | null
          direccion: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          razon_social: string
          rfc: string
          contacto_nombre?: string | null
          contacto_tel?: string | null
          contacto_email?: string | null
          direccion?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          razon_social?: string
          rfc?: string
          contacto_nombre?: string | null
          contacto_tel?: string | null
          contacto_email?: string | null
          direccion?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      normas_stps: {
        Row: {
          id: string
          clave: string
          nombre: string
          descripcion: string | null
          activa: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clave: string
          nombre: string
          descripcion?: string | null
          activa?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clave?: string
          nombre?: string
          descripcion?: string | null
          activa?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tecnicos: {
        Row: {
          id: string
          nombre: string
          apellidos: string
          rfc: string
          telefono: string | null
          email: string | null
          direccion: string | null
          estado: Database["public"]["Enums"]["estado_recurso"]
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          apellidos: string
          rfc: string
          telefono?: string | null
          email?: string | null
          direccion?: string | null
          estado?: Database["public"]["Enums"]["estado_recurso"]
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          apellidos?: string
          rfc?: string
          telefono?: string | null
          email?: string | null
          direccion?: string | null
          estado?: Database["public"]["Enums"]["estado_recurso"]
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      vehiculos: {
        Row: {
          id: string
          numero_unidad: string
          marca: string
          modelo: string
          anio: number
          placas: string
          color: string | null
          vin: string | null
          km_actual: number
          estado: Database["public"]["Enums"]["estado_recurso"]
          prox_mantto: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero_unidad: string
          marca: string
          modelo: string
          anio: number
          placas: string
          color?: string | null
          vin?: string | null
          km_actual?: number
          estado?: Database["public"]["Enums"]["estado_recurso"]
          prox_mantto?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero_unidad?: string
          marca?: string
          modelo?: string
          anio?: number
          placas?: string
          color?: string | null
          vin?: string | null
          km_actual?: number
          estado?: Database["public"]["Enums"]["estado_recurso"]
          prox_mantto?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      equipos_medicion: {
        Row: {
          id: string
          id_interno: string
          descripcion: string
          marca: string
          modelo: string
          numero_serie: string | null
          fecha_calibracion: string | null
          vigencia_calibracion: string | null
          lab_calibracion: string | null
          certificado_url: string | null
          estado: Database["public"]["Enums"]["estado_recurso"]
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          id_interno: string
          descripcion: string
          marca: string
          modelo: string
          numero_serie?: string | null
          fecha_calibracion?: string | null
          vigencia_calibracion?: string | null
          lab_calibracion?: string | null
          certificado_url?: string | null
          estado?: Database["public"]["Enums"]["estado_recurso"]
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          id_interno?: string
          descripcion?: string
          marca?: string
          modelo?: string
          numero_serie?: string | null
          fecha_calibracion?: string | null
          vigencia_calibracion?: string | null
          lab_calibracion?: string | null
          certificado_url?: string | null
          estado?: Database["public"]["Enums"]["estado_recurso"]
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tecnico_normas: {
        Row: {
          tecnico_id: string
          norma_id: string
        }
        Insert: {
          tecnico_id: string
          norma_id: string
        }
        Update: {
          tecnico_id?: string
          norma_id?: string
        }
      }
      norma_equipos: {
        Row: {
          norma_id: string
          equipo_tipo: string
          cantidad_requerida: number
        }
        Insert: {
          norma_id: string
          equipo_tipo: string
          cantidad_requerida?: number
        }
        Update: {
          norma_id?: string
          equipo_tipo?: string
          cantidad_requerida?: number
        }
      }
      ordenes_servicio: {
        Row: {
          id: string
          folio: string
          cliente_id: string
          direccion_servicio: string
          fecha_inicio: string
          fecha_fin: string
          estado: Database["public"]["Enums"]["estado_os"]
          observaciones: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          folio?: string
          cliente_id: string
          direccion_servicio: string
          fecha_inicio: string
          fecha_fin: string
          estado?: Database["public"]["Enums"]["estado_os"]
          observaciones?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          folio?: string
          cliente_id?: string
          direccion_servicio?: string
          fecha_inicio?: string
          fecha_fin?: string
          estado?: Database["public"]["Enums"]["estado_os"]
          observaciones?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ordenes_normas: {
        Row: {
          orden_servicio_id: string
          norma_id: string
        }
        Insert: {
          orden_servicio_id: string
          norma_id: string
        }
        Update: {
          orden_servicio_id?: string
          norma_id?: string
        }
      }
      asignaciones_tecnicos: {
        Row: {
          id: string
          orden_servicio_id: string
          tecnico_id: string
        }
        Insert: {
          id?: string
          orden_servicio_id: string
          tecnico_id: string
        }
        Update: {
          id?: string
          orden_servicio_id?: string
          tecnico_id?: string
        }
      }
      asignaciones_vehiculos: {
        Row: {
          id: string
          orden_servicio_id: string
          vehiculo_id: string
        }
        Insert: {
          id?: string
          orden_servicio_id: string
          vehiculo_id: string
        }
        Update: {
          id?: string
          orden_servicio_id?: string
          vehiculo_id?: string
        }
      }
      asignaciones_equipos: {
        Row: {
          id: string
          orden_servicio_id: string
          equipo_id: string
        }
        Insert: {
          id?: string
          orden_servicio_id: string
          equipo_id: string
        }
        Update: {
          id?: string
          orden_servicio_id?: string
          equipo_id?: string
        }
      }
      bloqueos_recursos: {
        Row: {
          id: string
          tipo_recurso: Database["public"]["Enums"]["tipo_recurso"]
          recurso_id: string
          tipo_bloqueo: Database["public"]["Enums"]["tipo_bloqueo"]
          fecha_inicio: string
          fecha_fin: string
          observaciones: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tipo_recurso: Database["public"]["Enums"]["tipo_recurso"]
          recurso_id: string
          tipo_bloqueo: Database["public"]["Enums"]["tipo_bloqueo"]
          fecha_inicio: string
          fecha_fin: string
          observaciones?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tipo_recurso?: Database["public"]["Enums"]["tipo_recurso"]
          recurso_id?: string
          tipo_bloqueo?: Database["public"]["Enums"]["tipo_bloqueo"]
          fecha_inicio?: string
          fecha_fin?: string
          observaciones?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      historial_cambios: {
        Row: {
          id: string
          tabla_afectada: string
          registro_id: string
          accion: Database["public"]["Enums"]["accion_auditoria"]
          datos_anteriores: Json | null
          datos_nuevos: Json | null
          usuario_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tabla_afectada: string
          registro_id: string
          accion: Database["public"]["Enums"]["accion_auditoria"]
          datos_anteriores?: Json | null
          datos_nuevos?: Json | null
          usuario_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tabla_afectada?: string
          registro_id?: string
          accion?: Database["public"]["Enums"]["accion_auditoria"]
          datos_anteriores?: Json | null
          datos_nuevos?: Json | null
          usuario_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      vista_calendario_recursos: {
        Row: {
          orden_id: string
          folio: string
          fecha_inicio: string
          fecha_fin: string
          estado_orden: Database["public"]["Enums"]["estado_os"]
          cliente: string
          cliente_rfc: string
          tecnicos: string[] | null
          vehiculos: string[] | null
          equipos: string[] | null
          normas: string[] | null
        }
      }
      vista_disponibilidad_diaria: {
        Row: {
          fecha: string
          total_tecnicos: number
          tecnicos_disponibles: number
          total_vehiculos: number
          vehiculos_disponibles: number
          total_equipos: number
          equipos_disponibles: number
        }
      }
    }
    Functions: {
      fn_verificar_disponibilidad_tecnico: {
        Args: {
          p_tecnico_id: string
          p_fecha_inicio: string
          p_fecha_fin: string
          p_orden_id?: string
        }
        Returns: {
          disponible: boolean
          motivo: string
        }[]
      }
      fn_verificar_disponibilidad_vehiculo: {
        Args: {
          p_vehiculo_id: string
          p_fecha_inicio: string
          p_fecha_fin: string
          p_orden_id?: string
        }
        Returns: {
          disponible: boolean
          motivo: string
        }[]
      }
      fn_verificar_disponibilidad_equipo: {
        Args: {
          p_equipo_id: string
          p_fecha_inicio: string
          p_fecha_fin: string
          p_orden_id?: string
        }
        Returns: {
          disponible: boolean
          motivo: string
        }[]
      }
      fn_verificar_vigencia_calibracion: {
        Args: {
          p_equipo_id: string
          p_fecha_servicio: string
        }
        Returns: {
          vigente: boolean
          dias_restantes: number
          motivo: string
        }[]
      }
      fn_generar_folio: {
        Args: Record<string, never>
        Returns: string
      }
    }
    Enums: {
      estado_os: "borrador" | "programada" | "en_curso" | "completada" | "cancelada"
      estado_recurso: "disponible" | "asignado" | "en_mantenimiento" | "en_calibracion" | "baja" | "vacaciones" | "incapacidad"
      tipo_bloqueo: "vacaciones" | "incapacidad" | "mantenimiento" | "calibracion" | "prestamo" | "otro"
      tipo_recurso: "tecnico" | "vehiculo" | "equipo"
      rol_usuario: "admin" | "coordinador" | "supervisor" | "tecnico"
      accion_auditoria: "INSERT" | "UPDATE" | "DELETE"
    }
  }
}

// Type aliases para uso en la aplicación
export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]

// Tipos de negocio
export type PerfilUsuario = Tables<"perfiles_usuario">
export type Cliente = Tables<"clientes">
export type NormaSTPS = Tables<"normas_stps">
export type Tecnico = Tables<"tecnicos">
export type Vehiculo = Tables<"vehiculos">
export type EquipoMedicion = Tables<"equipos_medicion">
export type OrdenServicio = Tables<"ordenes_servicio">
export type AsignacionTecnico = Tables<"asignaciones_tecnicos">
export type AsignacionVehiculo = Tables<"asignaciones_vehiculos">
export type AsignacionEquipo = Tables<"asignaciones_equipos">
export type BloqueoRecurso = Tables<"bloqueos_recursos">
export type HistorialCambio = Tables<"historial_cambios">
