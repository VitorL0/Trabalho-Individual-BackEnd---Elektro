import { z } from "zod";

const usuarioSchema = z.object({
    nome: z.string()
        .min(5, "Quantidade de caracteres mínima não atendida")
        .max(30, "Limite de caracteres atingido"),
        
    email: z.string()
        .email({ message: "Email inválido" }),
        
    cpf: z.string()
        .length(11, { message: "O CPF deve ter exatos 11 dígitos" }),
        
    dt_nascimento: z.coerce.date({ 
        message: "Data de nascimento inválida ou não fornecida" 
    }),
    
    numero: z.string()
        .min(8, "Número muito curto")
        .max(15, "Número muito longo")
        .optional(),
        
    senha: z.string()
        .min(5, "Senha muito pequena")
        .max(255, "Limite de caracteres atingido"),

    foto: z.string().optional()
});

export const usuarioCreateSchema = usuarioSchema;
export const usuarioUpdateSchema = usuarioSchema.partial();
export const usuarioLoginSchema = usuarioSchema.pick({ 
    email: true, 
    senha: true 
});

export type UsuarioCreateInput = z.infer<typeof usuarioCreateSchema>;
export type UsuarioUpdateInput = z.infer<typeof usuarioUpdateSchema>;
export type UsuarioLoginInput = z.infer<typeof usuarioLoginSchema>;