/*
  Warnings:

  - You are about to drop the `phone` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `phone` DROP FOREIGN KEY `Phone_contactId_fkey`;

-- AlterTable
ALTER TABLE `contact` ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `phone`;

-- CreateIndex
CREATE UNIQUE INDEX `Contact_phone_key` ON `Contact`(`phone`);
