/*
  Warnings:

  - A unique constraint covering the columns `[roomID]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Game_roomID_key" ON "Game"("roomID");
