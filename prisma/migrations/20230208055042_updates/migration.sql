/*
  Warnings:

  - You are about to drop the `address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `personaldata` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_hostId_fkey`;

-- DropForeignKey
ALTER TABLE `contact` DROP FOREIGN KEY `Contact_id_fkey`;

-- DropForeignKey
ALTER TABLE `personaldata` DROP FOREIGN KEY `personalData_userId_fkey`;

-- DropTable
DROP TABLE `address`;

-- DropTable
DROP TABLE `contact`;

-- DropTable
DROP TABLE `personaldata`;

-- CreateTable
CREATE TABLE `userPersonalData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cellNumber` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `dateOfBirth` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,

    UNIQUE INDEX `userPersonalData_email_key`(`email`),
    UNIQUE INDEX `userPersonalData_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hostAddress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `street` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `hostId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hostContact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `insta` VARCHAR(191) NULL,
    `face` VARCHAR(191) NULL,
    `mobile` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `hostContact_insta_key`(`insta`),
    UNIQUE INDEX `hostContact_face_key`(`face`),
    UNIQUE INDEX `hostContact_mobile_key`(`mobile`),
    UNIQUE INDEX `hostContact_phone_key`(`phone`),
    UNIQUE INDEX `hostContact_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userPersonalData` ADD CONSTRAINT `userPersonalData_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hostAddress` ADD CONSTRAINT `hostAddress_hostId_fkey` FOREIGN KEY (`hostId`) REFERENCES `Host`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hostContact` ADD CONSTRAINT `hostContact_id_fkey` FOREIGN KEY (`id`) REFERENCES `Host`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
