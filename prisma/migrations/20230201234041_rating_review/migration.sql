/*
  Warnings:

  - You are about to drop the column `rating` on the `host` table. All the data in the column will be lost.
  - You are about to drop the column `timesRated` on the `host` table. All the data in the column will be lost.
  - Added the required column `rating` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `host` DROP COLUMN `rating`,
    DROP COLUMN `timesRated`;

-- AlterTable
ALTER TABLE `review` ADD COLUMN `rating` INTEGER NOT NULL,
    MODIFY `text` VARCHAR(191) NULL;
