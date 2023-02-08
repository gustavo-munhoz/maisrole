import {prisma} from "../../lib/database.mjs";
import bcrypt from "bcrypt";

const HOST_FIELDS = {
    id: true,
    hostName: true,
    password: false,
    address: true,
    contact: true,
    reviews: true,
    roles: true
}


export async function signHost(host) {
    if (!await prisma.hostContact.findUnique({where: {email: host.email}})) {
        const dataForCreation = {
            hostName: host.hostName,
            password: await bcrypt.hash(host.password, await bcrypt.genSalt()),
            address: {
                create: {
                    street: host.address.street,
                    number: host.address.number,
                    cep: host.address.cep,
                    district: host.address.district,
                    city: host.address.state,
                    state: host.address.state
                }
            },
            contact: {
                create: {
                    insta: host.contact.insta,
                    face: host.contact.face,
                    mobile: host.contact.mobile,
                    email: host.contact.email,
                    phone: host.contact.phone
                }
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
        } else {
            return prisma.host.create({
                data: {
                    ...dataForCreation,
                    roles: host.roles
                }
            });
        }
    }
    else return null;
}

export async function loadById(id) {
    return prisma.host.findUnique({where: {id}, select: {...HOST_FIELDS}});
}

export async function loadByCredentials(email, password) {
    const host = await prisma.host.findFirst({
        where: {
            contact: {
                some: {
                    email: email
                }
            }
        },
        select: {
            ...HOST_FIELDS,
            password: true
        }
    });
    if (!host) return null

    if (!await bcrypt.compare(password, host.password)){
        return null;
    }
    delete host.password;
    return host;
}

export async function deleteHost(id) {
    const deleteContact = prisma.hostContact.delete({
        where: {id: id}
    });
    const deleteAddress = prisma.hostAddress.delete({
        where: {id: id}
    });

    const deleteUser = prisma.host.delete({
        where: {id: id}
    });

    return prisma.$transaction([deleteContact, deleteAddress, deleteUser])
}

export async function updateHost(host){
    const updateContact = prisma.hostContact.update({
        where: {
            id: host.id
        },
        data: {
            ...host.contact
        }
    });

    const updateAddress = prisma.hostAddress.update({
        where: {
            id: host.id
        },
        data: {
            ...host.address
        }
    });

    const updateHost = prisma.host.update({
        where: {
            id: host.id
        },
        data: {
            ...host
        }
    })

    return prisma.$transaction([updateContact, updateAddress, updateHost])
}

export async function insertReview(hostId, userId, rating, text) {
    return prisma.review.create({
        data: {
            postDate: new Date(),
            rating: rating,
            text: text,
            userId: userId,
            hostId: hostId
        }
    });
}

export async function getRating(id) {
    return prisma.review.findMany({
        where: {hostId: id},
        select: {rating: true}
    }).then(ratings =>
        (ratings.reduce((a, e) => a + e.rating, 0) / ratings.length).toFixed(2));
}

export async function getReviews(hostId) {
    return prisma.review.findMany({
        where: {
            hostId: hostId
        }
    });
}