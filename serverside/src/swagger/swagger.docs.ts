/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User APIs (authentication & account management)
 *   - name: Admin - Songs
 *     description: Admin APIs for managing songs
 *   - name: Admin - Artists
 *     description: Admin APIs for managing artists
 *   - name: Listener
 *     description: Listener APIs (browse songs & artists)
 */

/* ==============================
   USER (AUTH)
   ============================== */
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user with email & password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: Pass@123
 *     responses:
 *       200:
 *         description: User successfully logged in
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Old password incorrect
 *       404:
 *         description: User not found
 */

/* ==============================
   ADMIN - SONGS (RESTful)
   ============================== */
/**
 * @swagger
 * /admin/songs:
 *   post:
 *     summary: Add a new song
 *     tags: [Admin - Songs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, name, singers]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *                 example: Shape of You
 *               singers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64f8a12bcf1234567890abcd"]
 *     responses:
 *       201:
 *         description: Song added successfully
 *
 *   get:
 *     summary: Get all songs
 *     tags: [Admin - Songs]
 *     responses:
 *       200:
 *         description: List of songs
 */

/**
 * @swagger
 * /admin/songs/{id}:
 *   get:
 *     summary: Get song by ID
 *     tags: [Admin - Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song details
 *       404:
 *         description: Song not found
 *
 *   put:
 *     summary: Update a song
 *     tags: [Admin - Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               singers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Song updated
 *       404:
 *         description: Song not found
 *
 *   delete:
 *     summary: Delete a song
 *     tags: [Admin - Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song deleted
 */

/* ==============================
   ADMIN - ARTISTS (RESTful)
   ============================== */
/**
 * @swagger
 * /admin/artists:
 *   post:
 *     summary: Add a new artist
 *     tags: [Admin - Artists]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, roles]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Arijit Singh
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Singer"]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Artist added successfully
 *
 *   get:
 *     summary: Get all artists
 *     tags: [Admin - Artists]
 *     responses:
 *       200:
 *         description: List of artists
 */

/**
 * @swagger
 * /admin/artists/{id}:
 *   get:
 *     summary: Get artist by ID
 *     tags: [Admin - Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artist details
 *       404:
 *         description: Artist not found
 *
 *   put:
 *     summary: Update an artist
 *     tags: [Admin - Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Artist updated
 *       404:
 *         description: Artist not found
 *
 *   delete:
 *     summary: Delete an artist
 *     tags: [Admin - Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artist deleted
 */

/* ==============================
   LISTENER (READ-ONLY, RESTful)
   ============================== */
/**
 * @swagger
 * /listener/songs:
 *   get:
 *     summary: Get all songs
 *     tags: [Listener]
 *     responses:
 *       200:
 *         description: List of all songs
 */

/**
 * @swagger
 * /listener/songs/{id}:
 *   get:
 *     summary: Get song by ID
 *     tags: [Listener]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song details
 *       404:
 *         description: Song not found
 */

/**
 * @swagger
 * /listener/artists:
 *   get:
 *     summary: Get all artists
 *     tags: [Listener]
 *     responses:
 *       200:
 *         description: List of all artists
 */

/**
 * @swagger
 * /listener/artists/{id}:
 *   get:
 *     summary: Get artist by ID
 *     tags: [Listener]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artist details
 *       404:
 *         description: Artist not found
 */
