/*
  Warnings:

  - Added the required column `name` to the `page_sections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `page_sections` ADD COLUMN `name` VARCHAR(90) NOT NULL;
