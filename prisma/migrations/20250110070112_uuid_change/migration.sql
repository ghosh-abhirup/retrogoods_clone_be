/*
  Warnings:

  - The primary key for the `orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `productlot` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `orderproductpivots` DROP FOREIGN KEY `OrderProductPivots_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `orderproductpivots` DROP FOREIGN KEY `OrderProductPivots_productId_fkey`;

-- DropForeignKey
ALTER TABLE `orderproductpivots` DROP FOREIGN KEY `OrderProductPivots_productLotId_fkey`;

-- DropForeignKey
ALTER TABLE `productlot` DROP FOREIGN KEY `ProductLot_productId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlist` DROP FOREIGN KEY `Wishlist_productId_fkey`;

-- DropIndex
DROP INDEX `OrderProductPivots_orderId_fkey` ON `orderproductpivots`;

-- DropIndex
DROP INDEX `OrderProductPivots_productId_fkey` ON `orderproductpivots`;

-- DropIndex
DROP INDEX `OrderProductPivots_productLotId_fkey` ON `orderproductpivots`;

-- DropIndex
DROP INDEX `Orders_id_key` ON `orders`;

-- DropIndex
DROP INDEX `Product_id_key` ON `product`;

-- DropIndex
DROP INDEX `ProductLot_id_key` ON `productlot`;

-- DropIndex
DROP INDEX `ProductLot_productId_fkey` ON `productlot`;

-- DropIndex
DROP INDEX `User_id_key` ON `user`;

-- DropIndex
DROP INDEX `Wishlist_productId_fkey` ON `wishlist`;

-- AlterTable
ALTER TABLE `orderproductpivots` MODIFY `productId` VARCHAR(191) NOT NULL,
    MODIFY `productLotId` VARCHAR(191) NOT NULL,
    MODIFY `orderId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `orders` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `product` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `productlot` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `productId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `wishlist` MODIFY `productId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ProductLot` ADD CONSTRAINT `ProductLot_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderProductPivots` ADD CONSTRAINT `OrderProductPivots_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderProductPivots` ADD CONSTRAINT `OrderProductPivots_productLotId_fkey` FOREIGN KEY (`productLotId`) REFERENCES `ProductLot`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderProductPivots` ADD CONSTRAINT `OrderProductPivots_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wishlist` ADD CONSTRAINT `Wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
