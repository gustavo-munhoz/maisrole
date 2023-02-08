/*
  Warnings:

  - The primary key for the `review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `reviewuserhost` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `hostId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `reviewuserhost` DROP FOREIGN KEY `ReviewUserHost_hostId_fkey`;

-- DropForeignKey
ALTER TABLE `reviewuserhost` DROP FOREIGN KEY `ReviewUserHost_reviewId_fkey`;

-- DropForeignKey
ALTER TABLE `reviewuserhost` DROP FOREIGN KEY `ReviewUserHost_userId_fkey`;

-- AlterTable
ALTER TABLE `review` DROP PRIMARY KEY,
    ADD COLUMN `hostId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`, `userId`, `hostId`);

-- DropTable
DROP TABLE `reviewuserhost`;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_hostId_fkey` FOREIGN KEY (`hostId`) REFERENCES `Host`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
