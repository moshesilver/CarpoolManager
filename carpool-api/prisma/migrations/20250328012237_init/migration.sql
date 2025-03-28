-- CreateTable
CREATE TABLE "Address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "addressId" INTEGER NOT NULL,
    CONSTRAINT "Person_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Family" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personId" INTEGER NOT NULL,
    "familyId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    CONSTRAINT "Parent_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Parent_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Child" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personId" INTEGER NOT NULL,
    "familyId" INTEGER NOT NULL,
    "boosterSeat" BOOLEAN NOT NULL,
    "frontSeat" BOOLEAN NOT NULL,
    "carpoolId" INTEGER,
    CONSTRAINT "Child_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Child_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Child_carpoolId_fkey" FOREIGN KEY ("carpoolId") REFERENCES "Carpool" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CarpoolGroup" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TripTime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "carpoolGroupId" INTEGER NOT NULL,
    CONSTRAINT "TripTime_carpoolGroupId_fkey" FOREIGN KEY ("carpoolGroupId") REFERENCES "CarpoolGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Carpool" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "carpoolGroupId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    CONSTRAINT "Carpool_carpoolGroupId_fkey" FOREIGN KEY ("carpoolGroupId") REFERENCES "CarpoolGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Carpool_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Parent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CarpoolGroupAdmin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parentId" INTEGER NOT NULL,
    "carpoolGroupId" INTEGER NOT NULL,
    CONSTRAINT "CarpoolGroupAdmin_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CarpoolGroupAdmin_carpoolGroupId_fkey" FOREIGN KEY ("carpoolGroupId") REFERENCES "CarpoolGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ParentMembership" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "parentId" INTEGER NOT NULL,
    "carpoolGroupId" INTEGER NOT NULL,
    CONSTRAINT "ParentMembership_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ParentMembership_carpoolGroupId_fkey" FOREIGN KEY ("carpoolGroupId") REFERENCES "CarpoolGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChildMembership" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "childId" INTEGER NOT NULL,
    "carpoolGroupId" INTEGER NOT NULL,
    CONSTRAINT "ChildMembership_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChildMembership_carpoolGroupId_fkey" FOREIGN KEY ("carpoolGroupId") REFERENCES "CarpoolGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ParentTripTimeAvailability" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ParentTripTimeAvailability_A_fkey" FOREIGN KEY ("A") REFERENCES "ParentMembership" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ParentTripTimeAvailability_B_fkey" FOREIGN KEY ("B") REFERENCES "TripTime" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ChildTripTimeAvailability" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ChildTripTimeAvailability_A_fkey" FOREIGN KEY ("A") REFERENCES "ChildMembership" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ChildTripTimeAvailability_B_fkey" FOREIGN KEY ("B") REFERENCES "TripTime" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Family_email_key" ON "Family"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_personId_key" ON "Parent"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_email_key" ON "Parent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Child_personId_key" ON "Child"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "CarpoolGroupAdmin_parentId_carpoolGroupId_key" ON "CarpoolGroupAdmin"("parentId", "carpoolGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "ParentMembership_parentId_carpoolGroupId_key" ON "ParentMembership"("parentId", "carpoolGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "ChildMembership_childId_carpoolGroupId_key" ON "ChildMembership"("childId", "carpoolGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "_ParentTripTimeAvailability_AB_unique" ON "_ParentTripTimeAvailability"("A", "B");

-- CreateIndex
CREATE INDEX "_ParentTripTimeAvailability_B_index" ON "_ParentTripTimeAvailability"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChildTripTimeAvailability_AB_unique" ON "_ChildTripTimeAvailability"("A", "B");

-- CreateIndex
CREATE INDEX "_ChildTripTimeAvailability_B_index" ON "_ChildTripTimeAvailability"("B");
