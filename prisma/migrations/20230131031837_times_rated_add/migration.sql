/*
  Warnings:

  - You are about to drop the column `score` on the `host` table. All the data in the column will be lost.
  - Added the required column `rating` to the `Host` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timesRated` to the `Host` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `host` DROP COLUMN `score`,
    ADD COLUMN `rating` DOUBLE NOT NULL,
    ADD COLUMN `timesRated` INTEGER NOT NULL;
