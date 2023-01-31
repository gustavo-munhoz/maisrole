/*
  Warnings:

  - You are about to drop the `rolehost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roleuser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `rolehost` DROP FOREIGN KEY `RoleHost_hostId_fkey`;

-- DropForeignKey
ALTER TABLE `rolehost` DROP FOREIGN KEY `RoleHost_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `roleuser` DROP FOREIGN KEY `RoleUser_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `roleuser` DROP FOREIGN KEY `RoleUser_userId_fkey`;

-- DropTable
DROP TABLE `rolehost`;

-- DropTable
DROP TABLE `roleuser`;

-- CreateTable
CREATE TABLE `_RoleToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RoleToUser_AB_unique`(`A`, `B`),
    INDEX `_RoleToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_RoleToUser` ADD CONSTRAINT `_RoleToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Role`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoleToUser` ADD CONSTRAINT `_RoleToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
