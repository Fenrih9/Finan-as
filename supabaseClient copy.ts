import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ssbowdelpbxekcggcftc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzYm93ZGVscGJ4ZWtjZ2djZnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDEwNzIsImV4cCI6MjA4MjY3NzA3Mn0.hSZIK8BNS89sPd2LQroUwlRqcvTrZY6NxEbaPjxNCb4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);