/*
  Warnings:

  - You are about to drop the `CarpoolGroupAdmin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "CarpoolGroupAdmin_parentId_carpoolGroupId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CarpoolGroupAdmin";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ParentMembership" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parentId" INTEGER NOT NULL,
    "carpoolGroupId" INTEGER NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ParentMembership_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ParentMembership_carpoolGroupId_fkey" FOREIGN KEY ("carpoolGroupId") REFERENCES "CarpoolGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ParentMembership" ("carpoolGroupId", "id", "parentId") SELECT "carpoolGroupId", "id", "parentId" FROM "ParentMembership";
DROP TABLE "ParentMembership";
ALTER TABLE "new_ParentMembership" RENAME TO "ParentMembership";
CREATE UNIQUE INDEX "ParentMembership_parentId_carpoolGroupId_key" ON "ParentMembership"("parentId", "carpoolGroupId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
