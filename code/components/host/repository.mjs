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
// OK
export async function signHost(host) {
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
                phones: {
                    create: {
                        ...host.contact.phones
                    }
                }
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

// OK
export async function loadById(id) {
    // SELECT WHERE id -- ok
    return prisma.host.findUnique({where: {id}, select: {...HOST_FIELDS}});
}

// OK
export async function loadByCredentials(email, password) {
    // SELECT WHERE email AND password -- ok
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

// OK
export async function deleteHost(id) {
    //DELETE
    const deletePhone = prisma.phone.deleteMany({
        where: {
            id: id
        }
    })

    const deleteContact = prisma.contact.delete({
        where: {
            id: id
        }
    });
    const deleteAddress = prisma.address.delete({
        where: {
            id: id
        }
    })

    const deleteUser = prisma.host.delete({
        where: {
            id: id
        }});

    return prisma.$transaction([deletePhone, deleteContact, deleteAddress, deleteUser])
}

export async function insertReview(hostId, userId, rating, text) {
    const review = prisma.review.create({
        data: {
            postDate: new Date(),
            rating: rating,
            text: text
        }
    });
    const save = prisma.reviewUserHost.create({
        data: {
            hostId: hostId,
            userId: userId
        }
    });
    return prisma.$transaction([save, review]);
}

export async function getRating(hostId) {

}
//TEST
export async function updateHost(host){
    const updatePhone = prisma.phone.update({
        where: {
            id: host.id
        },
        data: {
            ...host.contact.phones
        }
    });

    const updateContact = prisma.contact.update({
        where: {
            id: host.id
        },
        data: {
            ...host.contact
        }
    });

    const updateAddress = prisma.address.update({
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

    return prisma.$transaction([updatePhone, updateContact, updateAddress, updateHost])
}