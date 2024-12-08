/*
  Warnings:

  - You are about to drop the column `status` on the `club_request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "club_request" DROP COLUMN "status";

-- DropEnum
DROP TYPE "club_request_status";
