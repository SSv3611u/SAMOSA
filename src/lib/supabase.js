import { createClient } from '@supabase/supabase-js';

// Create Supabase client with proper configuration
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
);

// Auth helpers
export const signUp = async (email, password) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData?.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([
          { 
            id: authData.user.id,
            username: email.split('@')[0],
            email: email
          }
        ]);

      if (profileError) throw profileError;
    }

    return { data: authData, error: null };
  } catch (err) {
    console.error('Signup error:', err);
    return { data: null, error: err };
  }
};

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Signin error:', err);
    return { data: null, error: err };
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Events helpers
export const getEvents = async (type = null) => {
  let query = supabase.from('events').select('*');
  if (type) {
    query = query.eq('type', type);
  }
  const { data, error } = await query;
  return { data, error };
};

export const getEventById = async (id) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

// Bookings helpers
export const getUserBookings = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      event:events(*),
      seat:seats(*),
      user:profiles(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

// Profile helpers
export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};