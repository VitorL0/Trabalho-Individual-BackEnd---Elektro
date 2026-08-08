import { Prisma } from "../generated/prisma/client";
import { prisma } from "../config/prisma";
import { Request, Response } from "express";

export class CompraController {
    public static async gerarCompra(req: Request, resp: Response) {
        try {
            const { id_usuario, valor, id_produtos_escolhidos, status, data } = req.body;

            const criarInput: Prisma.CompraCreateInput = {
                valor: parseFloat(valor),
                status: status,
                data: data ? new Date(data) : new Date(),
                id_produtos_escolhidos: id_produtos_escolhidos,
                usuario: { connect: { id: id_usuario } }
            };

            const compraCriada = await prisma.compra.create({
                data: criarInput
            });

            resp.status(201).json(compraCriada);
        } catch (error: any) {
            console.error(error);
            resp.status(500).json({ error: "Erro do servidor ao gerar compra" });
        }
    }

    public static async buscarCompra(req: Request, resp: Response) {
        try {
            const id_compra = String(req.params.id); // Assumindo que a rota continua sendo /compra/:id
            
            const compra = await prisma.compra.findUnique({
                where: { id_compra: id_compra },
                include: { usuario: true } // Opcional: traz os dados do usuário junto
            });

            if (!compra) {
                return resp.status(404).json({ error: "Compra não encontrada" });
            }

            resp.status(200).json(compra);
        } catch (error: any) {
            console.error(error);
            resp.status(500).json({ error: "Erro interno do servidor ao buscar compra" });
        }
    }

    public static async buscarTodasCompras(req: Request, resp: Response) {
        try {
            const compras = await prisma.compra.findMany();
            resp.status(200).json(compras);
        } catch (error: any) {
            console.error(error);
            resp.status(500).json({ error: "Erro interno do servidor ao buscar compras" });
        }
    }

    public static async atualizarCompra(req: Request, resp: Response) {
        try {
            const id_compra = String(req.params.id);
            const { valor, status, data, id_produtos_escolhidos } = req.body;
            const updateInput: Prisma.CompraUpdateInput = {};
            if (valor !== undefined) updateInput.valor = parseFloat(valor);
            if (status !== undefined) updateInput.status = status;
            if (data !== undefined) updateInput.data = new Date(data);
            if (id_produtos_escolhidos !== undefined) updateInput.id_produtos_escolhidos = id_produtos_escolhidos;

            const updatedCompra = await prisma.compra.update({
                where: { id_compra: id_compra },
                data: updateInput
            });

            resp.status(200).json(updatedCompra);
        } catch (error: any) {
            console.error(error);
            resp.status(500).json({ error: "Erro interno do servidor ao atualizar compra" });
        }
    }

    public static async deletarCompra(req: Request, resp: Response) {
        try {
            const id_compra = String(req.params.id);
            
            const deletedCompra = await prisma.compra.delete({
                where: { id_compra: id_compra }
            });

            resp.status(200).json(deletedCompra);
        } catch (error: any) {
            console.error(error);
            resp.status(500).json({ error: "Erro interno do servidor ao deletar compra" });
        }
    }
}