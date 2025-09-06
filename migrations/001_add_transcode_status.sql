-- Migration: add optional transcode_status to track worker processing
ALTER TABLE IF EXISTS booms ADD COLUMN IF NOT EXISTS transcode_status TEXT;
ALTER TABLE IF EXISTS fulltime ADD COLUMN IF NOT EXISTS transcode_status TEXT;
