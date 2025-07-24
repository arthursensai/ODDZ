/*
  Warnings:

  - Added the required column `adminID` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "adminID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_adminID_fkey" FOREIGN KEY ("adminID") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
