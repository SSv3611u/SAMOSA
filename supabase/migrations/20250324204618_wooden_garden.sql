/*
  # Initial Schema Setup for Ticket Booking System

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text)
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

-- Create profiles table
CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users,
    username text UNIQUE,
    phone text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create events table
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

-- Create seats table
CREATE TABLE seats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id uuid REFERENCES events ON DELETE CASCADE,
    seat_number text NOT NULL,
    category text NOT NULL CHECK (category IN ('regular', 'vip', 'premium')),
    price integer NOT NULL,
    is_booked boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Create bookings table
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

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Events policies
CREATE POLICY "Anyone can view events"
    ON events FOR SELECT
    TO authenticated
    USING (true);

-- Seats policies
CREATE POLICY "Anyone can view seats"
    ON seats FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can book available seats"
    ON seats FOR UPDATE
    TO authenticated
    USING (NOT is_booked);

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
    ON bookings FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
    ON bookings FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_seats_event_id ON seats(event_id);
CREATE INDEX idx_seats_is_booked ON seats(is_booked);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_event_id ON bookings(event_id);