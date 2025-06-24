import { supabase } from "/supabaseClient"

// Create
export const createItem = async (data) => {
    const { data: result, error } = await supabase.from('philsan_registration_2025').insert([data]).select('*')
    if (error) throw error
    return result
}

export const createDeletedItem = async (data) => {
    const { data: result, error } = await supabase.from('philsan_deleted_participants').insert([data]).select('*')
    if (error) throw error
    return result
}


export const createSponsor = async (data) => {
  const { sponsor_name, password } = data;

  // 1. Check if sponsor with same name or email already exists (case-insensitive)
  const { data: existing, error: checkError } = await supabase
    .from('philsan_2025_sponsors')
    .select('*')
    .or(`sponsor_name.ilike.${sponsor_name},password.ilike.${password}`);

  if (checkError) throw checkError;

  if (existing && existing.length > 0) {
    throw new Error(`Sponsor "${sponsor_name}" or email "${password}" already exists.`);
  }

  // 2. Insert new sponsor
  const { data: result, error } = await supabase
    .from('philsan_2025_sponsors')
    .insert([data]);

  if (error) throw error;

  return result;
};


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

export const getParticipant = async (email) => {
    const { data, error } = await supabase.from('philsan_registration_2025').select('*').eq('email', email).order('created_at', { ascending: false });
    if (error) throw error
    return data
}

export const getParticipants = async (sponsor, status) => {
    if(sponsor !== "Philsan Secretariat") {
        const { data, error } = await supabase
            .from('philsan_registration_2025')
            .select('*')
            .eq('reg_status', status)
            .eq('sponsor', sponsor)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } else {
        const { data, error } = await supabase
            .from('philsan_registration_2025')
            .select('*')
            .eq('reg_status', status)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }
};


export const getSponsorList = async (props) => {
    const { data, error } = await supabase
        .from('philsan_2025_sponsors')
        .select('*')
        .order('sponsor_name', { ascending: true });

    if (error) throw error;
    return data;
}

export const getSponsorByPassword = async (password) => {
    const { data, error } = await supabase
        .from('philsan_2025_sponsors')
        .select('*')
        .eq('password', password)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const storageUpload = async (filePath, file) => {
  const { data, error } = await supabase
    .storage
    .from('philsan-proof-of-payments')  // Bucket name
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true  // Overwrite if file exists
    });

  if (error) throw error;

  return data;
};

// Update
export const updateItem = async (email, data) => {
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

export const deleteSponsor = async ({id, name}) => {
    const { data, error } = await supabase
        .from('philsan_2025_sponsors')
        .delete()
        .eq("id", id)
        .eq("sponsor_name", name)

    if (error) throw error;
    return data;
}