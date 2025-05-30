import { supabase } from "/supabaseClient"

// Create
export const createItem = async (data) => {
    const { data: result, error } = await supabase.from('medical_professionals').insert([data])
    if (error) throw error
    return result
}

// Read
export const getItems = async () => {
    const { data, error } = await supabase.from('medical_professionals').select('*').order('created_at', { ascending: false });
    if (error) throw error
    return data
}

export const getTimeins = async () => {
    const { data, error } = await supabase
        .from('medical_professionals')
        .select('*')
        .not('time_in', 'is', null) // <-- filter out rows where time_in is null
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Update
export const updateItem = async (email, data) => {
    console.log("email", email)
    console.log("data", data)
    const { data: result, error } = await supabase.from('medical_professionals').update(data).eq('email_address', email).select()
    if (error) throw error
    return result
}

// Delete
export const deleteItem = async (email) => {
    const { data: result, error } = await supabase.from('medical_professionals').delete().eq('email_address', email)
    if (error) throw error
    return result
}

export const deleteWithCharaters = async () => {
    const { data, error } = await supabase
        .from('medical_professionals')
        .delete()
        .ilike('email_address', '%@example.com');

    if (error) throw error;
    return data;
}
