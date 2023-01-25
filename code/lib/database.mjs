import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt";

export const prisma = new PrismaClient()

async function makeRole(name) {
    const exists = await prisma.role.findUnique({where: {name}})
    if (exists) {
        console.log(`  Role ${name} found!`)
        return
    }
    await prisma.role.create({data: {name}})
    console.log(`  Role ${name} created!`)
}

async function makeAdmin() {
    const username = process.env.DEFAULT_ADMIN_NAME;
    const password = await bcrypt.hash(
        process.env.DEFAULT_ADMIN_PWD,
        await bcrypt.genSalt()
    )

    const exists = await prisma.user.findFirst({
        where: {
            roles: {
                some: {
                    name : 'ADMIN'
                }
            }
        }
    })
    if(exists) {
        console.log(`  Administrator found!  `)
        return
    }

    await prisma.user.create({
        data:{
            username,
            password,
            personalData: {},
            roles: {
                connect: [
                    {name: 'ADMIN'},
                    {name: 'USER'}
                ]
            }
        }
    })
    console.log(`  Administrator created!    `)
}

export async function bootstrapDb() {
    console.log("Checking initial data...")
    await makeRole('ADMIN');
    await makeRole('USER');
    await makeAdmin();
    console.log("Done!");
}