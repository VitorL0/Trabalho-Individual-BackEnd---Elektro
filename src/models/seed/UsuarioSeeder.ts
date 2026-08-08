import { prisma } from "../../config/prisma";
import { fakerPT_BR as faker } from '@faker-js/faker';
import auth from "../../config/auth";

export async function UsuarioSeeder(quantidade: number) {
    for (let i = 0; i < quantidade; i++) {
        const senhaPadrao = "Senha123!";
        const { hash, salt } = auth.generatePassword(senhaPadrao);
        const cpfAleatorio = faker.string.numeric(11);

        await prisma.usuario.create({
            data: {
                nome: faker.person.fullName(),
                email: faker.internet.email().toLowerCase(),
                cpf: cpfAleatorio,
                dt_nascimento: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
                numero: faker.phone.number(),
                foto: faker.image.avatar(),
                hash: hash,
                salt: salt,
            }
        });
    }

    console.log(`${quantidade} usuários criados no banco de dados!`);
}