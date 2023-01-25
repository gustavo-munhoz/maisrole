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

async function findCreators(){

    const andre = await prisma.user.findUnique({
        where: {
            username: 'andre'
        }
    });
    const gusta = await prisma.user.findUnique({
        where: {
            username: 'gusta'
        }
    });
    return [andre, gusta]
}
async function makeCreators() {
    const exists = await findCreators()
    if (exists[0] !== null && exists[1] !== null) {
        console.log('  Creators Found!')
        return
    }
    await prisma.user.create({
        data:
            {
                id: 2,
                username: 'andre',
                password: await bcrypt.hash('An@@2013/', await bcrypt.genSalt()),
                personalData: {},
                roles: {
                    connect: [
                        {name: 'ADMIN'},
                        {name: 'USER'}
                    ]
                }
            }


    });
    await prisma.user.create(
        {
            data: {
                id: 3,
                username: 'gusta',
                password: await bcrypt.hash('1234', await bcrypt.genSalt()),
                personalData: {},
                roles: {
                    connect: [
                        {name: 'ADMIN'},
                        {name: 'USER'}
                    ]
                }
            }
        }
    )
    console.log('  Creators Added!     ')
}
export async function bootstrapDb() {
    console.log("Checking initial data...")
    await makeRole('ADMIN');
    await makeRole('USER');
    await makeAdmin();
    await makeCreators();
    console.log("Done!");
}