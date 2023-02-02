import {getHost, login, register, removeHost, saveRating,} from "./service.mjs";

/**
 * @openapi
 * /hosts/register:
 *   post:
 *     summary: "Registers a new host"
 *
 *     tags:
 *       - "hostProfile"
 *
 *     operationId: hostRegister
 *     x-eov-operation-handler: host/routes
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: "#/components/schemas/HostRegister"
 *     responses:
 *       '201':
 *         description: "Host registered"
 *       '400':
 *         description: "Invalid data provided"
 *       '401':
 *         description: "Registration failed"
 */
export async function hostRegister(req, res, _) {
    const saved = await register(req.body);
    return saved ? res.sendStatus(201) : res.sendStatus(400);}

/**
 * @openapi
 * /host/login:
 *   post:
 *     summary: "Logs in the user"
 *
 *     tags:
 *       - "auth"
 *
 *     operationId: hostLogin
 *
 *     x-eov-operation-handler: host/routes
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UsernamePassword"
 *
 *     responses:
 *       '200':
 *         description: "User logged in"
 *       '400':
 *         description: "Invalid data provided"
 *       '401':
 *         description: "Login failed"
 */
export async function hostLogin(req, res, _) {
    const user = await login(req.body);
    return user ? res.json(user) : res.sendStatus(401);
}

/**
 * @openapi
 * /host/me:
 *   get:
 *     summary: "Retrieves user information"
 *
 *     tags:
 *       - "hostProfile"
 *
 *     operationId: printUser
 *     x-eov-operation-handler: host/routes
 *
 *     responses:
 *       '200':
 *         description: "Returns the user"
 *       '404':
 *         description: "User not found"
 *
 *     security:
 *       - {}
 *       - JWT: ['USER']
 */
export async function printHost(req, res, _) {
    if (!req.user) res.send("Hello, guest!");

    const user = await getHost(parseInt(req.user.id), true);
    return user ? res.json(user) : res.sendStatus(404);
}


/**
 * @openapi
 * /host/me:
 *   delete:
 *     summary: "Deletes the current user"
 *     tags:
 *       - "hostProfile"
 *
 *     operationId: deleteAccount
 *     x-eov-operation-handler: host/routes
 *
 *     responses:
 *       '200':
 *         description: "Account deleted successfully"
 *       '404':
 *         description: "Host not found"
 *
 *     security:
 *       - JWT: ['USER']
 */
export async function deleteAccount(req, res, _) {
    const deleted = await removeHost(req.user.id);
    return deleted ? res.sendStatus(200) : res.sendStatus(404);
}


export async function addRating(req, res, _) {
    const rated = await saveRating()
}