-- Reset (dev-friendly): remove prior Prisma tables if schema drifted
DROP TABLE IF EXISTS "DeityFestival" CASCADE;
DROP TABLE IF EXISTS "Festival" CASCADE;
DROP TABLE IF EXISTS "Sloka" CASCADE;
DROP TABLE IF EXISTS "Temple" CASCADE;
DROP TABLE IF EXISTS "Avatar" CASCADE;
DROP TABLE IF EXISTS "Song" CASCADE;
DROP TABLE IF EXISTS "MythicalBeing" CASCADE;
DROP TABLE IF EXISTS "Deity" CASCADE;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Deity" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "descriptionEn" TEXT,
    "descriptionTa" TEXT,
    "category" TEXT NOT NULL DEFAULT 'deva',
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "affiliation" TEXT,
    "abode" TEXT,
    "primaryImageUrl" TEXT,
    "attributes" JSONB,
    "relationships" JSONB,
    "worship" JSONB,
    "media" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sloka" (
    "id" TEXT NOT NULL,
    "deityId" TEXT NOT NULL,
    "title" TEXT,
    "sanskrit" TEXT NOT NULL,
    "transliteration" TEXT,
    "meaning" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sloka_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Temple" (
    "id" TEXT NOT NULL,
    "deityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "significance" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Temple_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avatar" (
    "id" TEXT NOT NULL,
    "deityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tradition" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "deityId" TEXT,
    "title" TEXT NOT NULL,
    "credit" TEXT,
    "externalUrl" TEXT NOT NULL,
    "licenseNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Festival" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Festival_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeityFestival" (
    "deityId" TEXT NOT NULL,
    "festivalId" TEXT NOT NULL,

    CONSTRAINT "DeityFestival_pkey" PRIMARY KEY ("deityId","festivalId")
);

-- CreateTable
CREATE TABLE "MythicalBeing" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "description" TEXT,
    "lore" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MythicalBeing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Deity_slug_key" ON "Deity"("slug");

-- CreateIndex
CREATE INDEX "Sloka_deityId_idx" ON "Sloka"("deityId");

-- CreateIndex
CREATE INDEX "Temple_deityId_idx" ON "Temple"("deityId");

-- CreateIndex
CREATE INDEX "Avatar_deityId_idx" ON "Avatar"("deityId");

-- CreateIndex
CREATE INDEX "Song_deityId_idx" ON "Song"("deityId");

-- CreateIndex
CREATE UNIQUE INDEX "Festival_slug_key" ON "Festival"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "MythicalBeing_slug_key" ON "MythicalBeing"("slug");

-- AddForeignKey
ALTER TABLE "Sloka" ADD CONSTRAINT "Sloka_deityId_fkey" FOREIGN KEY ("deityId") REFERENCES "Deity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Temple" ADD CONSTRAINT "Temple_deityId_fkey" FOREIGN KEY ("deityId") REFERENCES "Deity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avatar" ADD CONSTRAINT "Avatar_deityId_fkey" FOREIGN KEY ("deityId") REFERENCES "Deity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_deityId_fkey" FOREIGN KEY ("deityId") REFERENCES "Deity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeityFestival" ADD CONSTRAINT "DeityFestival_deityId_fkey" FOREIGN KEY ("deityId") REFERENCES "Deity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeityFestival" ADD CONSTRAINT "DeityFestival_festivalId_fkey" FOREIGN KEY ("festivalId") REFERENCES "Festival"("id") ON DELETE CASCADE ON UPDATE CASCADE;
