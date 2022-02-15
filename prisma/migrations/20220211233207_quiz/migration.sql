/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `quiz` ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Quiz_token_key` ON `Quiz`(`token`);
