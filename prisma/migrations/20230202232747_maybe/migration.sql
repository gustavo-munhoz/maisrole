-- CreateTable
CREATE TABLE `_HostToRole` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_HostToRole_AB_unique`(`A`, `B`),
    INDEX `_HostToRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_HostToRole` ADD CONSTRAINT `_HostToRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `Host`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_HostToRole` ADD CONSTRAINT `_HostToRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `Role`(`name`) ON DELETE CASCADE ON UPDATE CASCADE;
