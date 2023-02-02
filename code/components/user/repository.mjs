import {prisma} from "../../lib/database.mjs";
import bcrypt from "bcrypt";

const USER_FIELDS = {
    id: true,
    username: true,
    password: false,
    personalData: true,
    roles: true
}
export async function signUser(user) {
    //INSERT -- ok
    if (!user.roles){
        return prisma.user.create({
            data: {
                username: user.username,
                password: await bcrypt.hash(user.password, await bcrypt.genSalt()),
                personalData: {
                    create: {
                        firstName: user.personalData.firstName,
                        lastName: user.personalData.lastName,
                        cellNumber: user.personalData.cellNumber,
                        email: user.personalData.email
                    }
                },
                roles: {
                    connect: [
                        {name: 'USER'}
                    ]
                }
            }
        });
    }
    else {
        return prisma.user.create({
            data: {
                username: user.username,
                password: await bcrypt.hash(user.password, await bcrypt.genSalt()),
                personalData: {
                    create: {
                        firstName: user.personalData.firstName,
                        lastName: user.personalData.lastName,
                        cellNumber: user.personalData.cellNumber,
                        email: user.personalData.email
                    }
                },
                roles: user.roles
            }
        });
    }
}

export async function loadById(id) {
    // SELECT WHERE id -- ok
    return prisma.user.findUnique({where: {id}, select: {...USER_FIELDS} });
}
export async function loadByCredentials(username, password) {
    // SELECT WHERE username AND password -- ok
    const user = await prisma.user.findUnique({where: {username},
        select: {
            ...USER_FIELDS,
            password: true
        }});
    if (!user) return null

    if (!await bcrypt.compare(password, user.password)){
        return null;
    }
    delete user.password;
    return user;
}
export async function deleteUser(id) {
    //DELETE -- ok
    const deletePersonalData = prisma.personalData.delete({
        where: {
            userId: id
        }
    });
    const deleteUser = prisma.user.delete({
        where: {
            id: id
        }});
    return prisma.$transaction([deletePersonalData ,deleteUser])
}

export async function updateUser(user) {
    //UPDATE
    const updatePersonalData = prisma.personalData.update({
        where: {
            userId: user.id
            },
        data: {
            firstName: user.personalData.firstName,
            lastName: user.personalData.lastName,
            cellNumber: user.personalData.cellNumber,
            email: user.personalData.email,
            dateOfBirth: user.personalData.dateOfBirth
        }
    });
    const updateUser = prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            username: user.username,
            password: user.password,
            roles: user.roles
        }
    });
    return prisma.$transaction([updatePersonalData, updateUser])
}