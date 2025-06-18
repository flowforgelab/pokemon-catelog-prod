-- Pokemon Catalog Database Schema for Supabase
-- Updated with pricing and animeEra fields

-- Create tables
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL,
  "name" TEXT,
  "username" TEXT,
  "password" TEXT,
  "image" TEXT,
  "emailVerified" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Account" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Session" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Card" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "tcgId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "supertype" TEXT NOT NULL,
  "subtypes" TEXT[],
  "types" TEXT[],
  "hp" INTEGER,
  "retreatCost" TEXT[],
  "number" TEXT NOT NULL,
  "artist" TEXT,
  "rarity" TEXT,
  "flavorText" TEXT,
  "setId" TEXT NOT NULL,
  "setName" TEXT NOT NULL,
  "setLogo" TEXT,
  "setSeries" TEXT NOT NULL,
  "setPrintedTotal" INTEGER NOT NULL,
  "setTotal" INTEGER NOT NULL,
  "setReleaseDate" TIMESTAMP(3) NOT NULL,
  "imageSmall" TEXT NOT NULL,
  "imageLarge" TEXT NOT NULL,
  "nationalPokedexNumbers" INTEGER[],
  "rules" TEXT[],
  "ancientTrait" JSONB,
  "abilities" JSONB[],
  "attacks" JSONB[],
  "weaknesses" JSONB[],
  "resistances" JSONB[],
  "standardLegal" BOOLEAN NOT NULL DEFAULT false,
  "expandedLegal" BOOLEAN NOT NULL DEFAULT false,
  "unlimitedLegal" BOOLEAN NOT NULL DEFAULT true,
  "competitiveRating" INTEGER,
  "competitiveNotes" TEXT,
  "tcgplayerUrl" TEXT,
  "cardmarketUrl" TEXT,
  "marketPrice" DOUBLE PRECISION,
  "animeEra" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Collection" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "isPublic" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "CollectionCard" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "collectionId" TEXT NOT NULL,
  "cardId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "condition" TEXT NOT NULL DEFAULT 'NM',
  "language" TEXT NOT NULL DEFAULT 'EN',
  "isFirstEdition" BOOLEAN NOT NULL DEFAULT false,
  "isFoil" BOOLEAN NOT NULL DEFAULT false,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "CollectionCard_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Deck" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "format" TEXT NOT NULL,
  "isPublic" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "Deck_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "DeckCard" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "deckId" TEXT NOT NULL,
  "cardId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  
  CONSTRAINT "DeckCard_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PriceHistory" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "cardId" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "condition" TEXT NOT NULL,
  "marketPrice" DOUBLE PRECISION,
  "lowPrice" DOUBLE PRECISION,
  "midPrice" DOUBLE PRECISION,
  "highPrice" DOUBLE PRECISION,
  "directLow" DOUBLE PRECISION,
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PriceAlert" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "cardId" TEXT NOT NULL,
  "condition" TEXT NOT NULL DEFAULT 'NM',
  "targetPrice" DOUBLE PRECISION NOT NULL,
  "alertType" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "PriceAlert_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Trade" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'open',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "TradeCard" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "cardId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "condition" TEXT NOT NULL DEFAULT 'NM',
  
  CONSTRAINT "TradeCard_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Follow" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
  "followerId" TEXT NOT NULL,
  "followingId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX IF NOT EXISTS "Card_tcgId_key" ON "Card"("tcgId");
CREATE INDEX IF NOT EXISTS "Card_name_idx" ON "Card"("name");
CREATE INDEX IF NOT EXISTS "Card_setId_idx" ON "Card"("setId");
CREATE INDEX IF NOT EXISTS "Card_types_idx" ON "Card"("types");
CREATE INDEX IF NOT EXISTS "Card_rarity_idx" ON "Card"("rarity");
CREATE INDEX IF NOT EXISTS "Card_marketPrice_idx" ON "Card"("marketPrice");
CREATE INDEX IF NOT EXISTS "Card_animeEra_idx" ON "Card"("animeEra");
CREATE INDEX IF NOT EXISTS "Collection_userId_idx" ON "Collection"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "CollectionCard_unique" ON "CollectionCard"("collectionId", "cardId", "condition", "language", "isFirstEdition", "isFoil");
CREATE INDEX IF NOT EXISTS "CollectionCard_collectionId_idx" ON "CollectionCard"("collectionId");
CREATE INDEX IF NOT EXISTS "CollectionCard_cardId_idx" ON "CollectionCard"("cardId");
CREATE INDEX IF NOT EXISTS "Deck_userId_idx" ON "Deck"("userId");
CREATE INDEX IF NOT EXISTS "Deck_format_idx" ON "Deck"("format");
CREATE UNIQUE INDEX IF NOT EXISTS "DeckCard_deckId_cardId_key" ON "DeckCard"("deckId", "cardId");
CREATE INDEX IF NOT EXISTS "DeckCard_deckId_idx" ON "DeckCard"("deckId");
CREATE INDEX IF NOT EXISTS "DeckCard_cardId_idx" ON "DeckCard"("cardId");
CREATE INDEX IF NOT EXISTS "PriceHistory_cardId_source_recordedAt_idx" ON "PriceHistory"("cardId", "source", "recordedAt");
CREATE INDEX IF NOT EXISTS "PriceAlert_userId_idx" ON "PriceAlert"("userId");
CREATE INDEX IF NOT EXISTS "PriceAlert_cardId_idx" ON "PriceAlert"("cardId");
CREATE INDEX IF NOT EXISTS "Trade_userId_idx" ON "Trade"("userId");
CREATE INDEX IF NOT EXISTS "Trade_status_idx" ON "Trade"("status");
CREATE UNIQUE INDEX IF NOT EXISTS "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");
CREATE INDEX IF NOT EXISTS "Follow_followerId_idx" ON "Follow"("followerId");
CREATE INDEX IF NOT EXISTS "Follow_followingId_idx" ON "Follow"("followingId");

-- Add foreign keys
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "CollectionCard" ADD CONSTRAINT "CollectionCard_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE;
ALTER TABLE "CollectionCard" ADD CONSTRAINT "CollectionCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id");
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "DeckCard" ADD CONSTRAINT "DeckCard_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE;
ALTER TABLE "DeckCard" ADD CONSTRAINT "DeckCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id");
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id");
ALTER TABLE "PriceAlert" ADD CONSTRAINT "PriceAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "PriceAlert" ADD CONSTRAINT "PriceAlert_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"(id);
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE;

-- Create join tables for many-to-many relationships
CREATE TABLE IF NOT EXISTS "_WantCards" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "_HaveCards" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "_WantCards_AB_unique" ON "_WantCards"("A", "B");
CREATE INDEX IF NOT EXISTS "_WantCards_B_index" ON "_WantCards"("B");

CREATE UNIQUE INDEX IF NOT EXISTS "_HaveCards_AB_unique" ON "_HaveCards"("A", "B");
CREATE INDEX IF NOT EXISTS "_HaveCards_B_index" ON "_HaveCards"("B");

ALTER TABLE "_WantCards" ADD CONSTRAINT "_WantCards_A_fkey" FOREIGN KEY ("A") REFERENCES "Trade"("id") ON DELETE CASCADE;
ALTER TABLE "_WantCards" ADD CONSTRAINT "_WantCards_B_fkey" FOREIGN KEY ("B") REFERENCES "TradeCard"("id") ON DELETE CASCADE;

ALTER TABLE "_HaveCards" ADD CONSTRAINT "_HaveCards_A_fkey" FOREIGN KEY ("A") REFERENCES "Trade"("id") ON DELETE CASCADE;
ALTER TABLE "_HaveCards" ADD CONSTRAINT "_HaveCards_B_fkey" FOREIGN KEY ("B") REFERENCES "TradeCard"("id") ON DELETE CASCADE;