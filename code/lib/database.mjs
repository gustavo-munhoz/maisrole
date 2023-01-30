import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt";
import {debug, info} from "./logging.mjs";

export const prisma = new PrismaClient()

async function makeRole(name) {
    const exists = await prisma.role.findUnique({where: {name}})
    if (exists) {
        debug({description: `Role ${name} found!`});
        return
    }
    await prisma.role.create({data: {name}})
    info({description: `Role ${name} created!`})
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
    if (exists) {
        debug({description: `Administrator found!`});
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
    info({description: `Administrator created!`});
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
        debug({description: 'Creators Found!'});
        return
    }
    await prisma.user.create({
        data:
            {
                id: 2,
                username: 'andre',
                password: await bcrypt.hash('An@@2013/', await bcrypt.genSalt()),
                personalData: { create: {
                        cellNumber: "(41) 93823-3123",
                        firstName: "André",
                        lastName: "Wozniack",
                        dateOfBirth: "06/04/03",
                        email: "andre.wozniack@pucpr.edu.br"
                        }
                    },
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
                personalData: { create: {
                        cellNumber: "(41) 93120-2193",
                        firstName: "Gustavo",
                        lastName: "Munhoz Corrêa",
                        dateOfBirth: "11/04/01",
                        email: "munhoz.correa@pucpr.edu.br"
                        }
                    },
                roles: {
                    connect: [
                        {name: 'ADMIN'},
                        {name: 'USER'}
                    ]
                }
            }
        }
    )
    info({description: 'Creators Added!'});
}
export async function bootstrapDb() {
    debug({description: "Checking initial data..."});
    await makeRole('ADMIN');
    await makeRole('USER');
    await makeAdmin();
    await makeCreators();
    debug({description: "Done!"});
}