import {prisma} from "../../lib/database.mjs";

const EVENT_FIELDS = {
    id: true,
    hostId: true,
    startDate: true,
    endDate: true,
    price: true,
    brief: true,
    stateId: true
}


async function updateStatus(id) {
    const currentDate = new Date();
    const event = await prisma.event.findFirst({where: {id: id}, select: EVENT_FIELDS});
    const startDate = event.startDate;
    const endDate = event.endDate;

    if (currentDate > endDate) {
        return prisma.event.update({
            where: {id: id}, data: {...event, stateId: 2}
        });
    } else if (currentDate < startDate) {
        return prisma.event.update({
            where: {id: id}, data: {...event, stateId: 0}
        });
    } else {
        return prisma.event.update({
            where: {id: id}, data: {...event, stateId: 1}
        });
    }
}

export async function readEvent(id) {
    await updateStatus(id);
    return prisma.event.findUnique({
        where: {id: id}, select: EVENT_FIELDS
    });
}

export async function readAllEvents() {
    return prisma.event.findMany();
}

export async function readEventsByDates(date1, date2 = null) {
    if (date1 && date2) {
        return prisma.event.findMany({
            where: {
                OR: [
                    {
                        AND: [
                            {startDate: {gte: new Date(date1)}},
                            {startDate: {lte: new Date(date2)}}
                        ]},
                    {
                        AND: [
                            {endDate: {gte: new Date(date1)}},
                            {endDate: {lte: new Date(date2)}}
                        ]
                    }
                ]
            }
        });
    }
    return prisma.event.findMany({
        where: {
            AND: [
                {startDate: {lte: new Date(date1)}},
                {endDate: {gte: new Date(date1)}}
            ]
        }
    });
}
