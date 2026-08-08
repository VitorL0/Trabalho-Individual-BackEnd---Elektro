import { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";
import { Request, Response } from "express";
import auth from "../config/auth";
import { usuarioCreateSchema, usuarioUpdateSchema } from "../schemas/usuarioSchema";

export class UsuarioController {
    public static async gerarUsuario(req: Request, resp: Response) {
        try {
            const parsed = usuarioCreateSchema.safeParse(req.body);
            if (!parsed.success) {
                return resp.status(400).json({ error: parsed.error.issues });
            }

            // Atributos atualizados conforme a image_c9eaef.png
            const { nome, email, cpf, senha, numero, dt_nascimento } = parsed.data;
            const { hash, salt } = auth.generatePassword(senha);

            const createInput: Prisma.UsuarioCreateInput = {
                nome: nome,
                email: email,
                cpf: cpf,
                hash: hash,
                salt: salt,
                dt_nascimento: new Date(dt_nascimento),
                numero: numero ?? null 
            };
            const emailRepetido = await prisma.usuario.findUnique({
                where: { email }
            });

            if (emailRepetido) {
                return resp.status(409).json({ error: "Email já cadastrado" });
            }

            const cpfRepetido = await prisma.usuario.findUnique({
                where: { cpf }
            });

            if (cpfRepetido) {
                return resp.status(409).json({ error: "CPF já cadastrado" });
            }

            const createdUsuario = await prisma.usuario.create({
                data: createInput,
                select: {
                    id: true,
                    numero: true,
                    nome: true,
                    email: true,
                    cpf: true,
                    foto: true,
                    dt_nascimento: true
                }
            });

            resp.status(201).json(createdUsuario);
        } catch (error: any) {
            console.error(error);
            resp.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    public static async buscarUsuario(req: Request, resp: Response) {
        try {
            const id = String(req.params.id);
            if (req.user !== id) {
                return resp.status(403).json({ error: "Acesso negado" });
            }

            const usuario = await prisma.usuario.findUnique({
                where: { id },
                select: {
                    id: true,
                    numero: true,
                    nome: true,
                    email: true,
                    cpf: true,
                    foto: true,
                    dt_nascimento: true
                }
            });

            if (!usuario) {
                return resp.status(404).json({ error: "Usuário não encontrado" });
            }

            resp.status(200).json(usuario);
        } catch (error: any) {
            console.error(error);
            resp.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    public static async buscarTodosUsuarios(req: Request, resp: Response) {
        try {
            const usuarios = await prisma.usuario.findMany({
                select: {
                    id: true,
                    numero: true,
                    nome: true,
                    email: true,
                    cpf: true,
                    foto: true,
                    dt_nascimento: true
                }
            });
            resp.status(200).json(usuarios);
        } catch (error: any) {
            console.error(error);
            resp.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    public static async atualizarUsuario(req: Request, resp: Response) {
        try {
            const id = String(req.params.id);
            const parsed = usuarioUpdateSchema.safeParse(req.body);
            
            if (!parsed.success) {
                return resp.status(400).json({ error: parsed.error.issues });
            }
            if (req.user !== id) {
                return resp.status(403).json({ error: "Acesso negado" });
            }

            const { nome, email, cpf, senha, foto, numero, dt_nascimento } = parsed.data;
            const updateInput: Prisma.UsuarioUpdateInput = {};

            if (nome !== undefined) updateInput.nome = nome;
            if (email !== undefined) updateInput.email = email;
            if (cpf !== undefined) updateInput.cpf = cpf;
            if (foto !== undefined) updateInput.foto = foto;
            if (numero !== undefined) updateInput.numero = numero;
            if (dt_nascimento !== undefined) updateInput.dt_nascimento = new Date(dt_nascimento);
            
            if (senha) {
                const { hash, salt } = auth.generatePassword(senha);
                updateInput.hash = hash;
                updateInput.salt = salt;
            }

            const updatedUsuario = await prisma.usuario.update({
                where: { id },
                data: updateInput,
                select: {
                    id: true,
                    numero: true,
                    nome: true,
                    email: true,
                    cpf: true,
                    foto: true,
                    dt_nascimento: true
                }
            });

            resp.status(200).json(updatedUsuario);
        } catch (error: any) {
            console.error(error);
            resp.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    public static async deletarUsuario(req: Request, resp: Response) {
        try {
            const id = String(req.params.id);
            if (req.user !== id) {
                return resp.status(403).json({ error: "Acesso negado" });
            }

            const deletedUsuario = await prisma.usuario.delete({
                where: { id },
                select: {
                    id: true,
                    numero: true,
                    nome: true,
                    email: true,
                    cpf: true,
                    foto: true,
                    dt_nascimento: true
                }
            });

            resp.status(200).json(deletedUsuario);
        } catch (error: any) {
            console.error(error);
            resp.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    public static async loginUsuario(req: Request, resp: Response) {
        try {
            const { email, senha } = req.body;
            const usuario = await prisma.usuario.findUnique({
                where: { email }
            });

            if (!usuario) {
                return resp.status(404).json({ error: "Usuário não encontrado" });
            }

            const { hash, salt } = usuario;
            if (!auth.checkPassword(senha, hash, salt)) {
                return resp.status(400).json({ error: "Senha incorreta" });
            }

            const token = auth.generateJWT(usuario);
            resp.status(200).json({ message: "Token enviado", token: token });
        } catch (error: any) {
            console.error(error);
            resp.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    public static async uploadImagem(req: Request, resp: Response) {
        try {
            if (!req.file) {
                return resp.status(400).json({ error: "Nenhum arquivo enviado" });
            }
            if (req.user !== req.params.id) {
                return resp.status(403).json({ error: "Acesso negado" });
            }

            const id = String(req.params.id);
            
            // Alterado de urlImagem para foto
            const updated = await prisma.usuario.update({
                where: { id },
                data: { foto: req.file.filename }, 
                select: {
                    id: true,
                    numero: true,
                    nome: true,
                    email: true,
                    cpf: true,
                    foto: true,
                    dt_nascimento: true
                }
            });

            resp.status(200).json(updated);
        } catch (error: any) {
            console.error(error);
            resp.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    public static async testeAutenticacao(req: Request, resp: Response) {
        try {
            const token = auth.getToken(req);
            if (token instanceof Error || !token) {
                return resp.status(401).json({ error: "Token não fornecido ou em formato inválido" });
            }
            const decoded = auth.decodeJWT(token);
            if (!decoded) {
                return resp.status(401).json({ error: "Token inválido" });
            }

            resp.status(200).json({ message: "Token válido", token: token, decoded: decoded });
        } catch (error: any) {
            console.error(error);
            resp.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}