-- Create table for FAQ section settings
CREATE TABLE IF NOT EXISTS "faq_section_settings" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "subtitle" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
