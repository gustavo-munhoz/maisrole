/*
  Warnings:

  - A unique constraint covering the columns `[insta]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[face]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mobile]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `face` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `insta` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobile` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contact` ADD COLUMN `face` VARCHAR(191) NOT NULL,
    ADD COLUMN `insta` VARCHAR(191) NOT NULL,
    ADD COLUMN `mobile` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Contact_insta_key` ON `Contact`(`insta`);

-- CreateIndex
CREATE UNIQUE INDEX `Contact_face_key` ON `Contact`(`face`);

-- CreateIndex
CREATE UNIQUE INDEX `Contact_mobile_key` ON `Contact`(`mobile`);
