import { supabase } from "/supabaseClient"

// Create
export const createItem = async (data) => {
    const { data: result, error } = await supabase.from('philsan_registration_2025').insert([data])
    if (error) throw error
    return result
}

// Read
export const getItems = async () => {
    const { data, error } = await supabase.from('philsan_registration_2025').select('*').order('created_at', { ascending: false });
    if (error) throw error
    return data
}

export const getTimeins = async () => {
    const { data, error } = await supabase
        .from('philsan_registration_2025')
        .select('*')
        .not('time_in', 'is', null) // <-- filter out rows where time_in is null
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const getPendings = async () => {
    const { data, error } = await supabase
        .from('philsan_registration_2025')
        .select('*')
        .eq('reg_status', "pending")
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const getApproved = async () => {
    const { data, error } = await supabase
        .from('philsan_registration_2025')
        .select('*')
        .is('reg_status', null) // <-- filter out rows where time_in is null
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// Update
export const updateItem = async (email, data) => {
    console.log("email", email)
    console.log("data", data)
    const { data: result, error } = await supabase.from('philsan_registration_2025').update(data).eq('email', email).select()
    if (error) throw error
    return result
}

// Delete
export const deleteItem = async (email) => {
    const { data: result, error } = await supabase.from('philsan_registration_2025').delete().eq('email', email)
    if (error) throw error
    return result
}

export const deleteWithCharaters = async () => {
    const { data, error } = await supabase
        .from('philsan_registration_2025')
        .delete()
        .ilike('email', '%@example.com');

    if (error) throw error;
    return data;
}
