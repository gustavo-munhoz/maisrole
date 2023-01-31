/*
  Warnings:

  - You are about to drop the column `infoId` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `infoId` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the `info` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_infoId_fkey`;

-- DropForeignKey
ALTER TABLE `contact` DROP FOREIGN KEY `Contact_id_fkey`;

-- DropForeignKey
ALTER TABLE `info` DROP FOREIGN KEY `Info_hostId_fkey`;

-- AlterTable
ALTER TABLE `address` DROP COLUMN `infoId`,
    ADD COLUMN `hostId` INTEGER NULL;

-- AlterTable
ALTER TABLE `contact` DROP COLUMN `infoId`;

-- DropTable
DROP TABLE `info`;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_hostId_fkey` FOREIGN KEY (`hostId`) REFERENCES `Host`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_id_fkey` FOREIGN KEY (`id`) REFERENCES `Host`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
