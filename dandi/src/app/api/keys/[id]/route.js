import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// ... existing DELETE handler ...

// PATCH /api/keys/[id] - Update an API key
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { name, limit } = await request.json();
    
    const { data, error } = await supabase
      .from('api_keys')
      .update({ 
        name, 
        api_limit: limit
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 });
  }
}

// DELETE /api/keys/[id] - Delete an API key
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
  }
} 