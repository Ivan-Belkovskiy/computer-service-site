-- AlterTable
ALTER TABLE `page_sections` ADD COLUMN `custom_section_id` INTEGER NULL,
    MODIFY `name` VARCHAR(100) NOT NULL;

-- CreateTable
CREATE TABLE `custom_sections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `props` JSON NULL,
    `content` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `page_sections_custom_section_fkey` ON `page_sections`(`custom_section_id`);

-- AddForeignKey
ALTER TABLE `page_sections` ADD CONSTRAINT `page_sections_custom_section_id_fkey` FOREIGN KEY (`custom_section_id`) REFERENCES `custom_sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
