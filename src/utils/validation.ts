import { z } from 'zod';

// ===============================
// Common Custom Validations
// ===============================

// Name validation: 2-100 characters, letters and spaces allowed
export const nameSchema = z
  .string()
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(100, 'El nombre no puede exceder 100 caracteres')
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios');

// Phone validation: 8-15 digits, optional
export const phoneSchema = z
  .string()
  .min(8, 'El teléfono debe tener al menos 8 dígitos')
  .max(15, 'El teléfono no puede exceder 15 dígitos')
  .regex(/^[0-9+() -]*$/, 'El teléfono solo puede contener números y los caracteres +() -')
  .optional();

// List number validation: 1-3
export const listNumberSchema = z
  .union([z.literal(1), z.literal(2), z.literal(3)])
  .optional();

// Time validation: HH:mm format
export const timeSchema = z
  .string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'El formato de hora debe ser HH:mm')
  .optional();

// Message validation: 1-500 characters
export const messageSchema = z
  .string()
  .min(1, 'El mensaje no puede estar vacío')
  .max(500, 'El mensaje no puede exceder 500 caracteres');

// Date validation: YYYY-MM-DD format
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'El formato de fecha debe ser AAAA-MM-DD');

// ===============================
// Caddie Form Schemas
// ===============================

export const createCaddieSchema = z.object({
  name: nameSchema,
  listNumber: z.union([z.literal(1), z.literal(2), z.literal(3)], {
    message: 'La lista debe ser 1, 2 o 3',
  }).default(1),
  phoneNumber: phoneSchema,
  status: z
    .enum(['Disponible', 'En campo', 'Ausente'], {
      message: 'Estado inválido',
    })
    .default('Disponible'),
});

export const updateCaddieSchema = createCaddieSchema.partial();

export type CreateCaddieFormData = z.infer<typeof createCaddieSchema>;
export type UpdateCaddieFormData = z.infer<typeof updateCaddieSchema>;

// ===============================
// Turn Form Schemas
// ===============================

export const createTurnSchema = z.object({
  caddieId: z.string().uuid('ID de caddie inválido'),
  caddieName: nameSchema,
  listNumber: z.union([z.literal(1), z.literal(2), z.literal(3)], {
    message: 'La lista debe ser 1, 2 o 3',
  }),
});

export const updateTurnSchema = z.object({
  endTime: z.string().datetime().optional(),
  completed: z.boolean().optional(),
});

export type CreateTurnFormData = z.infer<typeof createTurnSchema>;
export type UpdateTurnFormData = z.infer<typeof updateTurnSchema>;

// ===============================
// Attendance Form Schemas
// ===============================

export const createAttendanceSchema = z.object({
  caddieId: z.string().uuid('ID de caddie inválido'),
  caddieName: nameSchema,
  listNumber: z.union([z.literal(1), z.literal(2), z.literal(3)], {
    message: 'La lista debe ser 1, 2 o 3',
  }),
  date: dateSchema,
  status: z.enum(['Presente', 'Llegó tarde', 'No vino', 'Permiso'], {
    message: 'Estado de asistencia inválido',
  }),
});

export const updateAttendanceSchema = z.object({
  status: z.enum(['Presente', 'Llegó tarde', 'No vino', 'Permiso'], {
    message: 'Estado de asistencia inválido',
  }).optional(),
  arrivalTime: z.string().datetime().optional(),
  turnsCount: z.number().int().nonnegative().optional(),
  endTime: z.string().datetime().optional(),
});

export type CreateAttendanceFormData = z.infer<typeof createAttendanceSchema>;
export type UpdateAttendanceFormData = z.infer<typeof updateAttendanceSchema>;

// ===============================
// List Settings Form Schemas
// ===============================

export const updateListSettingsSchema = z.object({
  callTime: timeSchema,
  order: z.enum(['ascendente', 'descendente'], {
    message: 'El orden debe ser ascendente o descendente',
  }).optional(),
  rangeStart: z.number().int().positive().optional(),
  rangeEnd: z.number().int().positive().optional(),
});

export const updateListOrderSchema = z.object({
  order: z.enum(['ascendente', 'descendente'], {
    message: 'El orden debe ser ascendente o descendente',
  }),
});

export type UpdateListSettingsFormData = z.infer<typeof updateListSettingsSchema>;
export type UpdateListOrderFormData = z.infer<typeof updateListOrderSchema>;

// ===============================
// Message Form Schemas
// ===============================

export const createMessageSchema = z.object({
  content: messageSchema,
  targetList: listNumberSchema,
});

export type CreateMessageFormData = z.infer<typeof createMessageSchema>;

// ===============================
// Auth Form Schemas
// ===============================

export const loginSchema = z.object({
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .max(100, 'La contraseña no puede exceder 100 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ===============================
// Report Form Schemas
// ===============================

export const reportRangeSchema = z.object({
  startDate: dateSchema,
  endDate: dateSchema,
});

export type ReportRangeFormData = z.infer<typeof reportRangeSchema>;

// ===============================
// Helpers
// ===============================

/**
 * Validate a form and return error message or null
 */
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { valid: boolean; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { valid: true, errors: {} };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    errors[path] = issue.message || 'Valor inválido';
  });

  return { valid: false, errors };
}
