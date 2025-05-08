/*
  Warnings:

  - You are about to drop the column `password` on the `Family` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[carpoolGroupId,driverId]` on the table `Carpool` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `CarpoolGroup` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[carpoolGroupId,label]` on the table `TripTime` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkUserId` to the `Family` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Family" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT,
    "clerkUserId" TEXT NOT NULL,
    "phone" TEXT
);
INSERT INTO "new_Family" ("email", "id", "phone") SELECT "email", "id", "phone" FROM "Family";
DROP TABLE "Family";
ALTER TABLE "new_Family" RENAME TO "Family";
CREATE UNIQUE INDEX "Family_email_key" ON "Family"("email");
CREATE UNIQUE INDEX "Family_clerkUserId_key" ON "Family"("clerkUserId");
CREATE UNIQUE INDEX "Family_phone_key" ON "Family"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Carpool_carpoolGroupId_driverId_key" ON "Carpool"("carpoolGroupId", "driverId");

-- CreateIndex
CREATE UNIQUE INDEX "CarpoolGroup_name_key" ON "CarpoolGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TripTime_carpoolGroupId_label_key" ON "TripTime"("carpoolGroupId", "label");
