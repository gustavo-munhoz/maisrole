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
    );

    const exists = await prisma.user.findFirst({
        where: {
            roles: {
                some: {
                    name: 'ADMIN'
                }
            }
        }
    });
    if (exists) {
        debug({description: `Administrator found!`});
        return
    }

    await prisma.user.create({
        data:{
            id: 1,
            username,
            password,
            personalData: {},
            roles: {
                connect: [
                    {name: 'ADMIN'},
                    {name: 'USER'},
                    {name: 'HOST'}
                ]
            }
        }
    });
    info({description: `Administrator created!`});
}

async function findCreators() {
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
    return [andre, gusta];
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
                password: await bcrypt.hash('mYp@s$w0rd', await bcrypt.genSalt()),
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
                password: await bcrypt.hash('mYp@s$w0rd', await bcrypt.genSalt()),
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

async function populateDatabase() {
    const users = await prisma.user.findMany({
        where: {
            NOT: {
                roles: {
                    some: {name: 'ADMIN'}
                }}}});
    const hosts = await prisma.host.findMany({
        where: {
            NOT: {
                roles: {
                    some: {name: 'ADMIN'}
                }}}});
    const reviews = await prisma.review.findMany();

    if (users.length === 0) {
        await makeAdmin();
        await makeCreators();
        await prisma.user.create({
            data: {
                username: "johndoe", password: await bcrypt.hash("mYp@s$w0rd", await bcrypt.genSalt()),
                personalData: {
                    create: {
                        cellNumber: "(11) 92302-1231",
                        firstName: "John",
                        lastName: "Doe",
                        dateOfBirth: "01/01/1999",
                        email: "johndoe@email.com"
                    }
                },
                roles: {
                    connect: [{name: "USER"}]
                }
            }
        });
        await prisma.user.create({
            data : {
                username: "james.smith", password: await bcrypt.hash("mYp@s$w0rd", await bcrypt.genSalt()),
                personalData: {
                    create: {
                        cellNumber: "(21) 91123-9402",
                        firstName: "James",
                        lastName: "Smith",
                        dateOfBirth: "21/04/1986",
                        email: "smith.james@outlook.com"
                    }
                },
                roles: {
                    connect: [{name: "USER"}]
                }
            }
        });
        await prisma.user.create({
            data: {
                username: "garciamaria", password: await bcrypt.hash("mYp@s$w0rd", await bcrypt.genSalt()),
                personalData: {
                    create: {
                        cellNumber: "(12) 94342-8382",
                        firstName: "Maria",
                        lastName: "Garcia",
                        dateOfBirth: "30/09/1992",
                        email: "mariagarcia@gmail.com"
                    }
                },
                roles: {
                    connect: [{name: "USER"}]
                }
            }
        });
        await prisma.user.create({
            data: {
                username: "watson.steph", password: await bcrypt.hash("mYp@s$w0rd", await bcrypt.genSalt()),
                personalData: {
                    create: {
                        cellNumber: "(80) 92321-9705",
                        firstName: "Stephanie",
                        lastName: "Watson",
                        dateOfBirth: "06/10/2001",
                        email: "stephanie.watson@gmail.com"
                    }
                },
                roles: {
                    connect: [{name: "USER"}]
                }
            }
        });

        await prisma.user.create({
            data: {
                username: "adampoole", password: await bcrypt.hash("mYp@s$w0rd", await bcrypt.genSalt()),
                personalData: {
                    create: {
                        cellNumber: "(41) 92320-1534",
                        firstName: "Stephanie",
                        lastName: "Watson",
                        dateOfBirth: "02/07/1978",
                        email: "adam.poole@gmail.com"
                    }
                },
                roles: {
                    connect: [{name: "USER"}]
                }
            }
        });
        info({description: "Users data created!"});
    } else {
        debug({description: "Users table data found!"});
    }

    if (hosts.length === 0) {
        await prisma.host.create({
            data: {
                hostName: "Ramos e Filhos",
                password: await bcrypt.hash("mYp@s$w0rd", await bcrypt.genSalt()),
                address: {
                    create: {
                        street: "Avenida Brasil",
                        number: "402",
                        cep: "84513-132",
                        district: "Centro",
                        city: "Curitiba",
                        state: "PR"
                    }
                },
                contact: {
                    create: {
                        insta: "@ramosefilhos",
                        face: "Ramos e Filhos",
                        mobile: "(41) 93292-2423",
                        email: "hsandoval@verdugo.com",
                        phone: "(41) 3212-4943"
                    }
                },
                roles: {
                    connect: [
                        {name: "HOST"}
                    ]
                }
            }
        });
        await prisma.host.create({
            data: {
                hostName: "Solano",
                password: await bcrypt.hash("mYp@s$w0rd", await bcrypt.genSalt()),
                address: {
                    create: {
                        street: "Rua João da Paz",
                        number: "123",
                        cep: "32304-123",
                        district: "Vila Leopoldina",
                        city: "São Paulo",
                        state: "SP"
                    }
                },
                contact: {
                    create: {
                        insta: "@solanobar",
                        face: "Solano",
                        mobile: "(11) 92593-0975",
                        email: "jsantiago@sanches.com.br",
                        phone: "(11) 3329-4493"
                    }
                },
                roles: {
                    connect: [
                        {name: "HOST"}
                    ]
                }
            }
        });
        await prisma.host.create({
            data: {
                hostName: "Rocha e Quintana",
                password: await bcrypt.hash("mYp@s$w0rd", await bcrypt.genSalt()),
                address: {
                    create: {
                        street: "Rua Silveira Pombo",
                        number: "1212",
                        cep: "11675250",
                        district: "Aquário",
                        city: "São José dos Campos",
                        state: "SC"
                    }
                },
                contact: {
                    create: {
                        insta: "@rochaequintana",
                        face: "Rocha e Quintana",
                        mobile: "(41) 90923-2321",
                        email: "elizabeth96@ferreira.org",
                        phone: "(12) 3568-7458"
                    }
                },
                roles: {
                    connect: [
                        {name: "HOST"}
                    ]
                }
            }
        });
        await prisma.host.create({
            data: {
                hostName: "Metzger",
                password: await bcrypt.hash("mYp@s$w0rd", await bcrypt.genSalt()),
                address: {
                    create: {
                        street: "Avenida das Nações",
                        number: "953",
                        cep: "42874-213",
                        district: "Mossunguê",
                        city: "Curitiba",
                        state: "PR"
                    }
                },
                contact: {
                    create: {
                        insta: "@metzgerpub",
                        face: "Metzger PUB",
                        mobile: "(41) 99404-2384",
                        email: "hildegard.kramer@glaser.com",
                        phone: "(41) 3290-0942"
                    }
                },
                roles: {
                    connect: [
                        {name: "HOST"}
                    ]
                }
            }
        });
        info({description: "Hosts data created!"});
    } else {
        debug({description: "Hosts table data found!"});
    }

    if (reviews.length === 0) {
        await prisma.review.create({
            data: {
                postDate: new Date(),
                rating: 2,
                text: "meh",
                userId: 2,
                hostId: 1
            }
        });
        await prisma.review.create({
            data: {
                postDate: new Date(),
                rating: 5,
                text: "very nice!!",
                userId: 6,
                hostId: 1
            }
        });
        await prisma.review.create({
            data: {
                postDate: new Date(),
                rating: 4,
                text: "good food",
                userId: 7,
                hostId: 1
            }
        });
        await prisma.review.create({
            data: {
                postDate: new Date("2022-10-15"),
                rating: 5,
                text: "First off I'm pretty sure porn or something was being filmed in the kitchen." +
                     "I would recommend.",
                userId: 4,
                hostId: 4
            }
        });
        await prisma.review.create({
            data: {
                postDate: new Date(),
                rating: 0,
                userId: 5,
                hostId: 3
            }
        });
        await prisma.review.create({
            data: {
                postDate: new Date(),
                rating: 2,
                text: "̝̯̙̼͚͈͇̩̮̗́͛ͦ̉ͤ̈́̌̑̑ͪ̆̎̈́͑̒ͦ̋̕͞ ͦ͊̽͆ͬ̈́͗̑́ͭͤͦ҉̴̬͚͈̩̼̪̬́ͅ",
                userId: 2,
                hostId: 3
            }
        });
        info({description: "Reviews data created!"});
    } else {
        debug({description: "Reviews data found!"});
    }
    await makeStatus();
    await makeWeekdays();
    await makeEventsType();
    await makeHostType();
}

async function makeStatus() {
    const exists = await prisma.eventState.findMany();
    if (exists.length === 0) {
        await prisma.eventState.createMany({
            data: [
                {
                    id: 0,
                    status: "To begin"
                },
                {
                    id: 1,
                    status: "Occurring"
                },
                {
                    id: 2,
                    status: "Ended"
                }
            ]
        });
        info({description: "Status created!"});
    }
    else {
        debug({description: "Status found!"});
    }
}

async function makeWeekdays() {
    const exists = await prisma.weekDay.findMany();
    if (exists.length === 0) {
        await prisma.weekDay.createMany({
            data: [
                {
                    id: 0,
                    day: "Sunday"
                },
                {
                    id: 1,
                    day: "Monday"
                },
                {
                    id: 2,
                    day: "Tuesday"
                },
                {
                    id: 3,
                    day: "Wednesday"
                },
                {
                    id: 4,
                    day: "Thursday"
                },
                {
                    id: 5,
                    day: "Friday"
                },
                {
                    id: 6,
                    day: "Saturday"
                },
            ]
        });
        info({description: "Week Days created!"});
    }
    else {
         debug({description: "Week Days found!"});
    }
}

async function makeEventsType() {
    const types = await prisma.eventType.findMany();
    if (types.length === 0) {
        await prisma.eventType.createMany({
            data: [
                {type: "Show"},
                {type: "Private Party"},
                {type: "Meeting"},
            ]
        });
        info({description: "Event types created!"});
    }
    else {
        debug({description: "Event types found!"})
    }
}

async function makeHostType() {
    const types = await prisma.hostType.findMany();
    if (types.length === 0) {
        await prisma.hostType.createMany({
            data:[
            {type:"Bar"},
            {type:"Club House"},
            {type:"Restaurant"},
            {type:"Private"}
        ]});
        info({description: "Host types created!"});
    }
    else {
        debug({description: "Host types found!"})
    }
}

export async function bootstrapDb() {
    debug({description: "Checking initial data..."});
    await makeRole('ADMIN');
    await makeRole('USER');
    await makeRole('HOST');
    await populateDatabase();
}