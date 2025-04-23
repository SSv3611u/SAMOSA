/*
  # Add Theater Showtimes and Update Booking Schema

  1. New Tables
    - `theaters`
      - `id` (uuid, primary key)
      - `name` (text)
      - `location` (text)
      - `created_at` (timestamp)

    - `showtimes`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `theater_id` (uuid, references theaters)
      - `start_time` (timestamp)
      - `price` (integer)
      - `created_at` (timestamp)

  2. Changes
    - Add `selected_seats` to bookings table
    - Add indexes for performance

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Create theaters table
CREATE TABLE theaters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    location text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create showtimes table
CREATE TABLE showtimes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id uuid REFERENCES events ON DELETE CASCADE,
    theater_id uuid REFERENCES theaters ON DELETE CASCADE,
    start_time timestamptz NOT NULL,
    price integer NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Add selected_seats to bookings
ALTER TABLE bookings ADD COLUMN selected_seats integer NOT NULL DEFAULT 1;

-- Enable RLS
ALTER TABLE theaters ENABLE ROW LEVEL SECURITY;
ALTER TABLE showtimes ENABLE ROW LEVEL SECURITY;

-- Theaters policies
CREATE POLICY "Anyone can view theaters"
    ON theaters FOR SELECT
    TO authenticated
    USING (true);

-- Showtimes policies
CREATE POLICY "Anyone can view showtimes"
    ON showtimes FOR SELECT
    TO authenticated
    USING (true);

-- Create indexes
CREATE INDEX idx_showtimes_event_id ON showtimes(event_id);
CREATE INDEX idx_showtimes_theater_id ON showtimes(theater_id);
CREATE INDEX idx_showtimes_start_time ON showtimes(start_time);