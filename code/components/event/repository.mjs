import {prisma} from "../../lib/database.mjs";

const EVENT_FIELDS = {
    id: true,
    hostId: true,
    startDate: true,
    endDate: true,
    price: true,
    brief: true,
    state: true
}


async function updateStatus(id) {
    const currentDate = new Date();
    const event = await prisma.event.findFirst({where: {id: id}, select: EVENT_FIELDS});
    const startDate = event.startDate;
    const endDate = event.endDate;

    if (currentDate > endDate) {
        return prisma.event.update({
            where: {id: id}, data: {...EVENT_FIELDS, state: 0}
        });
    } else if (currentDate < startDate) {
        return prisma.event.update({
            where: {id: id}, data: {...EVENT_FIELDS, state: 2}
        });
    } else {
        return prisma.event.update({
            where: {id: id}, data: {...EVENT_FIELDS, state: 1}
        });
    }
}

export async function readEvent(id) {
    await updateStatus(id);
    return prisma.event.findUnique({
        where: {id: id}, select: EVENT_FIELDS
    });
}

