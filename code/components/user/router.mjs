import {getUser, login, rate, register, removeUser, saveUser} from "./service.mjs";

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: "Registers a new user"
 *
 *     tags:
 *       - "profile"
 *
 *     operationId: userRegister
 *     x-eov-operation-handler: user/router
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: "#/components/schemas/Register"
 *     responses:
 *       '201':
 *         description: "User registered"
 *       '400':
 *         description: "Invalid data provided"
 *       '401':
 *         description: "Registration failed"
 */
export async function userRegister(req, res, _) {
    const saved = await register(req.body);
    return saved ? res.sendStatus(201) : res.sendStatus(400);}

/**
 * @openapi
 * /user/login:
 *   post:
 *     summary: "Logs in the user"
 *
 *     tags:
 *       - "auth"
 *
 *     operationId: userLogin
 *
 *     x-eov-operation-handler: user/router
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
export async function userLogin(req, res, _) {
    const user = await login(req.body);
    return user ? res.json(user) : res.sendStatus(401);
}

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: "Retrieves user information"
 *
 *     tags:
 *       - "profile"
 *
 *     operationId: printUser
 *     x-eov-operation-handler: user/router
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
export async function printUser(req, res, _) {
    if (!req.user) res.send("Hello, guest!");

    const user = await getUser(parseInt(req.user.id), true);
    return user ? res.json(user) : res.sendStatus(404);
}

/**
 * @openapi
 * /info:
 *   get:
 *     summary: "Retrieves creators information"
 *
 *     tags:
 *       - "profile"
 *
 *     operationId: showCreators
 *     x-eov-operation-handler: user/router
 *
 *     responses:
 *       '200':
 *         description: "Returns the creator information"
 *
 */
export async function showCreators(req, res, _) {
    return res.json({
        creator1: await getUser(2, true),
        creator2: await getUser(3, true)});
}

/**
 * @openapi
 * /users/me:
 *   delete:
 *     summary: "Deletes the current user"
 *     tags:
 *       - profile
 *
 *     operationId: deleteAccount
 *     x-eov-operation-handler: user/router
 *
 *     responses:
 *       '200':
 *         description: "Account deleted successfully"
 *       '404':
 *         description: "User not found"
 *
 *     security:
 *       - JWT: ['USER']
 */
export async function deleteAccount(req, res, _) {
    const deleted = await removeUser(req.user.id);
    return deleted ? res.sendStatus(200) : res.sendStatus(404);
}

/**
 * @openapi
 * /users/me:
 *   put:
 *     summary: "Updates user information"
 *
 *     tags:
 *       - "profile"
 *
 *     operationId: updateAccount
 *     x-eov-operation-handler: user/router
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: "#/components/schemas/Update"
 *
 *     responses:
 *       '200':
 *         description: "User updated successfully"
 *       '400':
 *         description: "Invalid data provided"
 *       '404':
 *         description: "User not found"
 *
 *     security:
 *       - JWT: ['USER']
 */
export async function updateAccount(req, res, _) {
    const saved = await saveUser({id: req.user.id, ...req.body});
    return saved ? res.json({id: req.user.id, ...req.body}) : res.sendStatus(404);
}

/**
 * @openapi
 * /users/me/rating/{hostId}:
 *   put:
 *     summary: "Adds a rating to desired host"
 *
 */
export async function userRateHost(req, res, _) {
    const rated = await rate()
}