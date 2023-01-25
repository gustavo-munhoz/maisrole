import {prisma} from "../../lib/database.mjs";
import bcrypt from "bcrypt";

const USER_FIELDS = {
    id: true,
    username: true,
    password: false,
    personalData: {
        id: false,
        cellNumber: false,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        email: true
    },
    roles: true
}

export async function signUser(user) {
    //INSERT
    await prisma.user.create({data: {...user}});
}

export async function loadById(id) {
    // SELECT WHERE id
    return prisma.user.findUnique({where: id});
}

export async function loadByCredentials(username, password) {
    // SELECT WHERE username AND password
    return prisma.user.findUnique({where: username,
        select: {...USER_FIELDS,
            password: false}})
}

export async function deleteUser(id) {
    //DELETE
    return prisma.user.delete({where: id})
}

export async function updateUser(user) {
    //UPDATE
    return prisma.user.update({where: user.id, data: {...user}});
}
