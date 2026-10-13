/*
  Warnings:

  - You are about to drop the column `createdAt` on the `admin_users` table. All the data in the column will be lost.
  - You are about to alter the column `login` on the `admin_users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `document_number` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `specialization` on the `partners` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(180)`.
  - You are about to drop the column `category` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `displayOrder` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `displayInNavigation` on the `site_pages` table. All the data in the column will be lost.
  - You are about to alter the column `key` on the `site_settings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the column `createdAt` on the `tracking_events` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `tracking_events` table. All the data in the column will be lost.
  - You are about to alter the column `event` on the `tracking_events` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(80)`.
  - A unique constraint covering the columns `[email]` on the table `admin_users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[document_number]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Made the column `status` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `services` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_client_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_master_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_partner_id_fkey`;

-- DropForeignKey
ALTER TABLE `services` DROP FOREIGN KEY `services_category_id_fkey`;

-- DropIndex
DROP INDEX `services_category_fkey` ON `services`;

-- DropIndex
DROP INDEX `tracking_events_event_createdAt_idx` ON `tracking_events`;

-- AlterTable
ALTER TABLE `admin_users`
    RENAME COLUMN `createdAt` TO `created_at`,
    ADD COLUMN `email` VARCHAR(100) NULL,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `last_login_at` DATETIME(3) NULL,
    ADD COLUMN `role` ENUM('ADMIN', 'MANAGER', 'VIEWER') NOT NULL DEFAULT 'ADMIN',
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `login` VARCHAR(50) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `clients` ADD COLUMN `address` VARCHAR(255) NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `notes` TEXT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `custom_sections` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `masters` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `address` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `order_items` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `notes` TEXT NULL,
    ADD COLUMN `service_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `completed_at` DATETIME(3) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `status` ENUM('CREATED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'CREATED',
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `description` TEXT NULL,
    MODIFY `address` VARCHAR(255) NULL,
    MODIFY `video_url` VARCHAR(500) NULL,
    MODIFY `document_number` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `partners` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `email` VARCHAR(100) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `address` VARCHAR(255) NULL,
    MODIFY `specialization` VARCHAR(180) NOT NULL;

-- AlterTable
ALTER TABLE `services`
    RENAME COLUMN `category` TO `category_id`,
    RENAME COLUMN `displayOrder` TO `display_order`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `name` VARCHAR(90) NOT NULL,
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `site_pages`
    RENAME COLUMN `displayInNavigation` TO `display_in_navigation`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `is_published` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);


-- AlterTable
ALTER TABLE `site_settings` ADD COLUMN `description` VARCHAR(255) NULL,
    MODIFY `key` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `tracking_events`
    CHANGE COLUMN `createdAt` `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CHANGE COLUMN `userAgent` `user_agent` VARCHAR(500) NULL,
    MODIFY `event` VARCHAR(80) NOT NULL,
    MODIFY `path` VARCHAR(500) NOT NULL;


-- CreateTable
CREATE TABLE `legal_documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(80) NOT NULL,
    `title` VARCHAR(180) NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `url_type` ENUM('PAGE', 'EXTERNAL') NOT NULL DEFAULT 'PAGE',
    `display_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `show_in_footer` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `legal_documents_slug_key`(`slug`),
    INDEX `legal_documents_display_order_idx`(`display_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `admin_users_email_key` ON `admin_users`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `categories_name_key` ON `categories`(`name`);

-- CreateIndex
CREATE INDEX `order_items_service_id_idx` ON `order_items`(`service_id`);

-- CreateIndex
CREATE UNIQUE INDEX `orders_document_number_key` ON `orders`(`document_number`);

-- CreateIndex
CREATE INDEX `orders_created_at_idx` ON `orders`(`created_at`);

-- CreateIndex
CREATE INDEX `orders_status_created_at_idx` ON `orders`(`status`, `created_at`);

-- CreateIndex
CREATE INDEX `page_sections_page_id_display_order_idx` ON `page_sections`(`page_id`, `display_order`);

-- CreateIndex
CREATE INDEX `services_category_id_idx` ON `services`(`category_id`);

-- CreateIndex
CREATE INDEX `services_category_id_display_order_idx` ON `services`(`category_id`, `display_order`);

-- CreateIndex
CREATE INDEX `tracking_events_event_created_at_idx` ON `tracking_events`(`event`, `created_at`);

-- CreateIndex
CREATE INDEX `tracking_events_path_idx` ON `tracking_events`(`path`);

-- CreateIndex
CREATE INDEX `tracking_events_created_at_idx` ON `tracking_events`(`created_at`);

-- AddForeignKey
ALTER TABLE `services` ADD CONSTRAINT `services_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_master_id_fkey` FOREIGN KEY (`master_id`) REFERENCES `masters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_partner_id_fkey` FOREIGN KEY (`partner_id`) REFERENCES `partners`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_service_id_fkey` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `order_items` RENAME INDEX `order_items_order_fkey` TO `order_items_order_id_idx`;

-- RenameIndex
ALTER TABLE `orders` RENAME INDEX `orders_client_fkey` TO `orders_client_id_idx`;

-- RenameIndex
ALTER TABLE `orders` RENAME INDEX `orders_master_fkey` TO `orders_master_id_idx`;

-- RenameIndex
ALTER TABLE `orders` RENAME INDEX `orders_partner_fkey` TO `orders_partner_id_idx`;

-- RenameIndex
ALTER TABLE `page_sections` RENAME INDEX `page_sections_custom_section_fkey` TO `page_sections_custom_section_id_idx`;

-- RenameIndex
ALTER TABLE `page_sections` RENAME INDEX `page_sections_page_fkey` TO `page_sections_page_id_idx`;
