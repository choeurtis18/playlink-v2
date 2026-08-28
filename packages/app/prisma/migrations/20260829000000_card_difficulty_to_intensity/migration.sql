-- Remplace `difficulty` (easy | medium | hard) par `intensity` (1..5)
ALTER TABLE "cards" DROP COLUMN IF EXISTS "difficulty";
ALTER TABLE "cards" ADD COLUMN IF NOT EXISTS "intensity" INTEGER NOT NULL DEFAULT 3;
