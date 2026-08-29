// Supabase Client Initialization
const SUPABASE_URL = 'https://cxjzsknccmuomapwgdbi.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Jm29RUv4sp49w10L3O1sCw_-N57dYz-'; // Paste your Supabase Publishable Key here

// Initialize Supabase client
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) : null;

