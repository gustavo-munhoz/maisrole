import {prisma} from "../../lib/database.mjs";
import bcrypt from "bcrypt";

const HOST_FIELDS = {
    id: true,
    hostName: true,
    password: false,
    score: true,
    info: true,
    reviews: true,
}

export async function signHost(host) {
    const dataForCreation = {
        hostName: host.hostName,
        password: await bcrypt.hash(host.password, await bcrypt.genSalt()),
        score: host.score,
        info: {
            create: {
                address: {
                    create: {
                        street: host.info.address.street,
                        number: host.info.address.number,
                        cep: host.info.address.cep,
                        district: host.info.address.district,
                        city: host.info.address.state,
                        state: host.info.address.state
                    }
                },
                contact: {
                    create: {
                        insta: host.info.insta,
                        face: host.info.face,
                        mobile: host.info.mobile,
                        email: host.info.email,
                        phones: {
                            createMany: [
                                ...host.info.contact.phones
                            ]
                        }
                    }
                }
            }
        },
        reviews: {
            createMany: [
                ...host.reviews
            ]
        }
    }
    if (!host.roles) {
        return prisma.host.create({
            data: {
                ...dataForCreation,
                roles: {
                    connect: [
                        {name: 'HOST'}
                    ]
                }
            }
        });
    }

    else {
        return prisma.host.create({
            data: {
                ...dataForCreation,
                roles: host.roles
            }
        });
    }
}

export async function loadById(id) {
    // SELECT WHERE id -- ok
    return prisma.host.findUnique({where: {id}, select: {...HOST_FIELDS}});
}

export async function loadByCredentials(email, password) {
    // SELECT WHERE email AND password -- ok
    const host = await prisma.host.findUnique({
        where: {
            contact: {
                email: email
            }
        },
        select: {
            ...HOST_FIELDS,
            password: true
        }});
    if (!host) return null

    if (!await bcrypt.compare(password, host.password)){
        return null;
    }
    delete host.password;
    return host;
}