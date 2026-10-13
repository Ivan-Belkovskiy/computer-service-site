-- AlterTable
ALTER TABLE `legal_documents` ADD COLUMN `show_in_modal` BOOLEAN NOT NULL DEFAULT false;

UPDATE `legal_documents`
   SET `show_in_modal` = true
 WHERE `slug` IN ('privacy_policy', 'public_offer');