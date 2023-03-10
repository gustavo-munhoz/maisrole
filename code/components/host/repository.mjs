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

function getNumberOfDays(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);
    return Math.round(Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
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

export async function insertReview(hostId, userId, review) {
    const lastReviewDate = await prisma.review.findMany({
        where: {
            userId: userId,
            hostId: hostId
        }
    }).then(ratings => ratings.length !== 0 ?
        ratings.reduce((a, b) => a.postDate > b.postDate ? a : b).postDate : 0
    );

    if (getNumberOfDays(new Date(), lastReviewDate) <= 7) return null;

    return prisma.review.create({
        data: {
            postDate: new Date(),
            rating: review.rating,
            text: review.text,
            userId: userId,
            hostId: hostId
        }
    });
}

export async function getRating(id) {
    return prisma.review.findMany({
        where: {hostId: id},
        select: {rating: true}
    }).then(ratings => ratings.length === 0 ? 0 :
        (ratings.reduce((a, e) => a + e.rating, 0) / ratings.length).toFixed(2));
}

export async function filterReviewsByHost(id) {
    return prisma.review.findMany({
        where: {
            hostId: id
        }
    });
}

export async function insertEvent(hostId, event) {
    let id = 0;
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (startDate > now && endDate > now)
    return prisma.event.create({
        data: {
            name: event.name,
            hostId: hostId,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
            price: event.price,
            brief: event.brief,
            stateId: id
        }
    });
}

export async function deleteEvent(eventId, hostId) {

    return prisma.event.delete({
        where: {

        }
    });
}

export async function updateEvent(eventId, hostId, newData) {
    return prisma.event.update({
        where: {id: eventId, hostId: hostId}, data: newData}
    ).catch(null);
}

export async function filterEventsByHost(hostId) {
    return prisma.event.findMany({where: {hostId: hostId}});
}