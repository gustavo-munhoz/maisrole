/*
  Warnings:

  - You are about to drop the `data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `data` DROP FOREIGN KEY `Data_userId_fkey`;

-- DropTable
DROP TABLE `data`;

-- CreateTable
CREATE TABLE `personalData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cellNumber` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `personalData_email_key`(`email`),
    UNIQUE INDEX `personalData_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `personalData` ADD CONSTRAINT `personalData_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
