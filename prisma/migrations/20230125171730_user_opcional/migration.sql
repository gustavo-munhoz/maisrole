-- DropForeignKey
ALTER TABLE `personaldata` DROP FOREIGN KEY `personalData_userId_fkey`;

-- AlterTable
ALTER TABLE `personaldata` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `personalData` ADD CONSTRAINT `personalData_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
