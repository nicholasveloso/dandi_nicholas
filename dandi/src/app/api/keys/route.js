import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import crypto from 'crypto';

// Helper function to generate API keys
function generateApiKey() {
  return `tvly_${crypto.randomBytes(16).toString('hex')}`;
}

// GET /api/keys - Fetch all API keys
export async function GET() {
  try {
    const { data: apiKeys, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return NextResponse.json(apiKeys || []);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
  }
}

// POST /api/keys - Create new API key
export async function POST(request) {
  try {
    const { name, limit } = await request.json();
    
    const newKey = {
      name,
      api_limit: limit,
      key: generateApiKey(),
      usage: 0,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert([newKey])
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
  }
} 