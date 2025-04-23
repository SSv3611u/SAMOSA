/*
  # Initial Schema Setup for Ticket Booking System

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text)
      - `email` (text)
      - `phone` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `type` (text: movie, sport, concert)
      - `venue` (text)
      - `date` (timestamp)
      - `image_url` (text)
      - `price` (integer)
      - `created_at` (timestamp)
      - `status` (text: upcoming, ongoing, completed)

    - `seats`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `seat_number` (text)
      - `category` (text: regular, vip, premium)
      - `price` (integer)
      - `is_booked` (boolean)
      - `created_at` (timestamp)

    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `event_id` (uuid, references events)
      - `seat_id` (uuid, references seats)
      - `booking_date` (timestamp)
      - `payment_status` (text: pending, completed, failed)
      - `payment_method` (text: card, upi)
      - `amount` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'profiles') THEN
    CREATE TABLE profiles (
      id uuid PRIMARY KEY REFERENCES auth.users,
      username text UNIQUE,
      email text,
      phone text,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create events table if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'events') THEN
    CREATE TABLE events (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      type text NOT NULL CHECK (type IN ('movie', 'sport', 'concert')),
      venue text NOT NULL,
      date timestamptz NOT NULL,
      image_url text,
      price integer NOT NULL,
      created_at timestamptz DEFAULT now(),
      status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed'))
    );
  END IF;
END $$;

-- Create seats table if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'seats') THEN
    CREATE TABLE seats (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id uuid REFERENCES events ON DELETE CASCADE,
      seat_number text NOT NULL,
      category text NOT NULL CHECK (category IN ('regular', 'vip', 'premium')),
      price integer NOT NULL,
      is_booked boolean DEFAULT false,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create bookings table if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'bookings') THEN
    CREATE TABLE bookings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES profiles ON DELETE CASCADE,
      event_id uuid REFERENCES events ON DELETE CASCADE,
      seat_id uuid REFERENCES seats ON DELETE CASCADE,
      booking_date timestamptz DEFAULT now(),
      payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
      payment_method text CHECK (payment_method IN ('card', 'upi')),
      amount integer NOT NULL,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable Row Level Security
DO $$ BEGIN
  EXECUTE 'ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS events ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS seats ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE IF EXISTS bookings ENABLE ROW LEVEL SECURITY';
END $$;

-- Drop existing policies if they exist and create new ones
DO $$ BEGIN
  -- Profiles policies
  DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
  
  CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

  CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

  -- Events policies
  DROP POLICY IF EXISTS "Anyone can view events" ON events;
  
  CREATE POLICY "Anyone can view events"
    ON events FOR SELECT
    TO authenticated
    USING (true);

  -- Seats policies
  DROP POLICY IF EXISTS "Anyone can view seats" ON seats;
  DROP POLICY IF EXISTS "Users can book available seats" ON seats;
  
  CREATE POLICY "Anyone can view seats"
    ON seats FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Users can book available seats"
    ON seats FOR UPDATE
    TO authenticated
    USING (NOT is_booked);

  -- Bookings policies
  DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
  DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
  
  CREATE POLICY "Users can view their own bookings"
    ON bookings FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can create bookings"
    ON bookings FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
END $$;

-- Create indexes if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_events_type') THEN
    CREATE INDEX idx_events_type ON events(type);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_events_status') THEN
    CREATE INDEX idx_events_status ON events(status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_seats_event_id') THEN
    CREATE INDEX idx_seats_event_id ON seats(event_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_seats_is_booked') THEN
    CREATE INDEX idx_seats_is_booked ON seats(is_booked);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bookings_user_id') THEN
    CREATE INDEX idx_bookings_user_id ON bookings(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_bookings_event_id') THEN
    CREATE INDEX idx_bookings_event_id ON bookings(event_id);
  END IF;
END $$;