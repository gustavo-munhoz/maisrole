/*
  Warnings:

  - You are about to drop the column `tel` on the `contact` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_infoId_fkey`;

-- DropForeignKey
ALTER TABLE `contact` DROP FOREIGN KEY `Contact_id_fkey`;

-- DropForeignKey
ALTER TABLE `info` DROP FOREIGN KEY `Info_hostId_fkey`;

-- DropForeignKey
ALTER TABLE `reviewuserhost` DROP FOREIGN KEY `ReviewUserHost_hostId_fkey`;

-- DropForeignKey
ALTER TABLE `reviewuserhost` DROP FOREIGN KEY `ReviewUserHost_reviewId_fkey`;

-- DropForeignKey
ALTER TABLE `reviewuserhost` DROP FOREIGN KEY `ReviewUserHost_userId_fkey`;

-- AlterTable
ALTER TABLE `contact` DROP COLUMN `tel`;

-- CreateTable
CREATE TABLE `Phone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(191) NOT NULL,
    `contactId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Info` ADD CONSTRAINT `Info_hostId_fkey` FOREIGN KEY (`hostId`) REFERENCES `Host`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_infoId_fkey` FOREIGN KEY (`infoId`) REFERENCES `Info`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_id_fkey` FOREIGN KEY (`id`) REFERENCES `Info`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Phone` ADD CONSTRAINT `Phone_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewUserHost` ADD CONSTRAINT `ReviewUserHost_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewUserHost` ADD CONSTRAINT `ReviewUserHost_hostId_fkey` FOREIGN KEY (`hostId`) REFERENCES `Host`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewUserHost` ADD CONSTRAINT `ReviewUserHost_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `Review`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
