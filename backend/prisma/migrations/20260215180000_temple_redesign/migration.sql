-- Temple redesign: rich fields + nullable deity link; backfill from legacy columns.

ALTER TABLE "Temple" ADD COLUMN "nameEnglish" TEXT;
ALTER TABLE "Temple" ADD COLUMN "nameTamil" VARCHAR(255);
ALTER TABLE "Temple" ADD COLUMN "city" TEXT;
ALTER TABLE "Temple" ADD COLUMN "overview" TEXT;
ALTER TABLE "Temple" ADD COLUMN "sthalaPuranam" TEXT;
ALTER TABLE "Temple" ADD COLUMN "literaryBackground" TEXT;
ALTER TABLE "Temple" ADD COLUMN "puranaBackground" TEXT;
ALTER TABLE "Temple" ADD COLUMN "deitiesText" TEXT;
ALTER TABLE "Temple" ADD COLUMN "poojaTimings" TEXT;
ALTER TABLE "Temple" ADD COLUMN "festivalsEvents" TEXT;
ALTER TABLE "Temple" ADD COLUMN "specialities" TEXT;
ALTER TABLE "Temple" ADD COLUMN "howToReach" TEXT;
ALTER TABLE "Temple" ADD COLUMN "contactInfo" TEXT;
ALTER TABLE "Temple" ADD COLUMN "imageGalleryUrls" JSONB;

UPDATE "Temple"
SET
  "nameEnglish" = "name",
  "city" = "location",
  "overview" = "significance";

ALTER TABLE "Temple" ALTER COLUMN "nameEnglish" SET NOT NULL;
ALTER TABLE "Temple" ALTER COLUMN "city" SET NOT NULL;

ALTER TABLE "Temple" DROP COLUMN "name";
ALTER TABLE "Temple" DROP COLUMN "location";
ALTER TABLE "Temple" DROP COLUMN "significance";

ALTER TABLE "Temple" ALTER COLUMN "deityId" DROP NOT NULL;

CREATE INDEX "Temple_city_idx" ON "Temple"("city");
