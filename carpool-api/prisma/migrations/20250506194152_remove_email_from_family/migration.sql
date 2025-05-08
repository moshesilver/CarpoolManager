/*
  Warnings:

  - You are about to drop the column `email` on the `Family` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Family" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clerkUserId" TEXT NOT NULL,
    "phone" TEXT
);
INSERT INTO "new_Family" ("clerkUserId", "id", "phone") SELECT "clerkUserId", "id", "phone" FROM "Family";
DROP TABLE "Family";
ALTER TABLE "new_Family" RENAME TO "Family";
CREATE UNIQUE INDEX "Family_clerkUserId_key" ON "Family"("clerkUserId");
CREATE UNIQUE INDEX "Family_phone_key" ON "Family"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
