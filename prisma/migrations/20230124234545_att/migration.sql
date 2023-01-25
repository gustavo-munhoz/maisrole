/*
  Warnings:

  - You are about to drop the `_personaldatatouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `personaldata` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_personaldatatouser` DROP FOREIGN KEY `_PersonalDataToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_personaldatatouser` DROP FOREIGN KEY `_PersonalDataToUser_B_fkey`;

-- DropTable
DROP TABLE `_personaldatatouser`;

-- DropTable
DROP TABLE `personaldata`;

-- CreateTable
CREATE TABLE `Data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cellNumber` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Data_email_key`(`email`),
    UNIQUE INDEX `Data_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Data` ADD CONSTRAINT `Data_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
