/*
  Warnings:

  - You are about to drop the column `clubId` on the `event` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_clubId_fkey";

-- AlterTable
ALTER TABLE "event" DROP COLUMN "clubId",
ADD COLUMN     "club_id" INTEGER,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "club"("id") ON DELETE SET NULL ON UPDATE CASCADE;
