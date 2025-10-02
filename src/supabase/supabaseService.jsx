import { supabase } from "/supabaseClient"

// Create
export const createItem = async (data) => {
    const { data: result, error } = await supabase.from('philsan_registration_2025').insert([data]).select('*')
    if (error) throw error
    return result
}

export const createDeletedItem = async (data) => {
    const toSubmitData = {
        user_id: data.id,
        email: data.email,
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        mobile: data.mobile,
        company: data.company,
        membership: data.membership,
        agri_license: data.agri_license,
        sponsor: data.sponsor,
        reg_request: data.req_request, 
        reg_status: data.reg_status,
        position: data.position,
        souvenir: data.souvenir,
        certificate_needed: data.certificate_needed,
        payment: data.payment,
        token: data.token,
        time_in: data.time_in,
        time_out: data.time_out,
        remarks: data.remarks
    };
    const { data: result, error } = await supabase.from('philsan_deleted_participants').insert([toSubmitData]).select('*')
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


export const createSurveyResponse = async (data) => {
  const results = []; // collect all inserts

  for (const item of data) {
    const toSubmitData = {
      participant: item.participant,
      question_id: item.id,
      question: item.question,
      question_type: item.question_type,
      choices: item.choices,
      response: item.response,
      order: item.order,
    };

    const { data: result, error } = await supabase
      .from("philsan_survey_responses")
      .insert([toSubmitData])
      .select("*")
      .order('order', { ascending: true });

    if (error) throw error;

    results.push(result[0]); // store inserted row
  }

  return results; // ✅ return all rows
};


export const createQuizResponse = async (data) => {
  const results = []; // collect all inserts

  for (const item of data) {
    const toSubmitData = {
      email: item.email,
      question_id: item.id,
      question: item.question,
      choice: item.choice,
      choice_index: item.choice_index,
      correct_answer: item.correct_answer,
      answer_result: item.correct_answer === item.choice_index ? 1 : 0
    };

    console.log("toSubmit", toSubmitData)

    const { data: result, error } = await supabase
      .from("philsan_quiz_response")
      .insert([toSubmitData])
      .select("*")
      .order('order', { ascending: true });

    if (error) throw error;

    results.push(result[0]); // store inserted row
  }

  return results; // ✅ return all rows
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
    const { data, error } = await supabase.from('philsan_registration_2025').select('*').ilike('email', email).order('created_at', { ascending: false });
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

export const getSurvey = async () => {
    const { data, error } = await supabase
        .from('philsan_survey')
        .select('*')
        .order('order', { ascending: true });

    if (error) throw error;
    return data;
};

export const getSurveyResponse = async (email) => {
    const { data, error } = await supabase
        .from("philsan_survey_responses")
        .select('*')
        .eq('participant', email)
        .order('order', { ascending: true });

    if (error) throw error;
    return data;
};

export const getSpeaker = async () => {
    const { data, error } = await supabase
        .from('philsan_speaker_topic')
        .select('*')
        .order('id', { ascending: true });

    if (error) throw error;
    return data;
};

export const getQuiz = async () => {
    const { data, error } = await supabase
        .from('philsan_quiz')
        .select('*')
        .order('id', { ascending: true });

    if (error) throw error;
    return data;
};

export const getParticipantQuiz = async (email) => {
  console.log("email 2", email)
    const { data, error } = await supabase
        .from("philsan_quiz_response")
        .select('*')
        .eq('email', email)

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

export const updateTimein = async ({email, action}) => {
  console.log(action)

  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const formatDateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const actions = {
    "time-in": { formatted_time_in: formatDateTime, time_in: now.toISOString() },
    "time-out": { formatted_time_out: formatDateTime, time_out: now.toISOString() },
    "delete-timein": { formatted_time_in: null, time_in: null },
    "delete-timeout": { formatted_time_out: null, time_out: null },
  };

  const toSubmit = actions[action];
  if (!toSubmit) throw new Error("Invalid action");

  const { data: result, error } = await supabase
    .from("philsan_registration_2025")
    .update(toSubmit)
    .eq("email", email)
    .select();

  if (error) throw error;
  return result;
};


export const updateSurveyResponse = async (data) => {
  const results = [];

  for (const item of data) {
    const toSubmitData = {
      participant: item.participant,
      question_id: item.id,
      question: item.question,
      question_type: item.question_type,
      choices: item.choices,
      response: item.response,
      order: item.order,
    };

    const { data: result, error } = await supabase
      .from("philsan_survey_responses")
      .update(toSubmitData)
      .eq("participant", item.participant) // 👈 column name should match your schema
      .eq("question_id", item.id) // 👈 important to target the right question
      .select("*")
      .order('order', { ascending: true });

    if (error) throw error;

    results.push(result[0]);
  }

  return results;
};

export const updateSurveyCompleted = async (email) => {
  const { data, error } = await supabase
    .from('philsan_registration_2025')
    .update({ survey_completed: true }) // only update this column
    .eq('email', email)
    .select(); // optional, remove if you don’t need the updated row

  if (error) throw error;
  return data;
};

export const updateQuizResult = async (email) => {
  const participant = await getParticipantQuiz(email);

  
  const quizResult = participant.reduce((sum, i) => sum + i.answer_result, 0);

  const toSubmitData = {quiz_result: quizResult}

  const { data: result, error } = await supabase.from('philsan_registration_2025').update(toSubmitData).eq('email', email).select()
  if (error) throw error
  return result
};

// Delete
export const deleteItem = async (id, email) => {
    const { data: result, error } = await supabase
    .from('philsan_registration_2025')
    .delete()
    .eq('id', id)
    .eq('email', email)
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