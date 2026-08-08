import { UsuarioSeeder } from "../seed/UsuarioSeeder";
import { prisma } from "../../config/prisma"; 

async function main() {
    await prisma.$connect();
    await UsuarioSeeder(20); 
    console.log("Seed finalizado com sucesso!");
}

const resultado: Promise<void> = main();

resultado.then(async () => {
    await prisma.$disconnect();
});

resultado.catch(async (e: any) => {
    console.error("Erro durante o seed:", e);
    await prisma.$disconnect();
    process.exit(1);
});