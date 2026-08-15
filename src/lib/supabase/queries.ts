import { supabase } from './client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function subscribeToTable<T>(
  table: string,
  uid: string,
  onChange: (rows: T[]) => void
): RealtimeChannel {
  const fetchAndEmit = async () => {
    console.log(`Fetching data for table: ${table}, uid: ${uid}`);
    console.log("Fetching", table);

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

       console.log({
        table,
        data,
        error,
        });
    if (!error && data) onChange(data as T[]);
  };

  fetchAndEmit();

 const channel = supabase
  .channel(`${table}-${uid}`)
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table,
      // filter: `user_id=eq.${uid}`,
    },
    (payload) => {
      console.log("Realtime payload:", payload);
      fetchAndEmit();
    }
  )
  .subscribe((status, err) => {
    console.log(`${table} status:`, status);

    if (err) {
      console.error("Realtime error:", err);
    }
  });

return channel;

}

export async function insertRow<T>(table: string, data: object): Promise<T> {
  const { data: row, error } = await supabase.from(table).insert(data).select().single();

    console.log("Inserted row:", row);
  console.log("Insert error:", error);
  
  if (error) throw error;
  return row as T;
}

export async function updateRow(table: string, id: string, updates: object) {
  const { error } = await supabase.from(table).update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteRow(table: string, id: string) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}