import emailjs from "@emailjs/browser";
import { getItems, deleteWithCharaters, updateItem, deleteItem, createItem } from '../../../supabase/supabaseService';

export const onApprove = (props) => {
    const col= props.selectedCol
    const data = props.data

    updateItem(data.email, {
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        mobile: data.mobile,
        company: data.company,
        agri_license: data.agri_license,
        remarks: null,
        reg_status: "approved"
    })
    .then((res) => {
        const fullname = res[0].first_name + " " + res[0].last_name

        console.log("fullname", fullname)
        emailjs.send(
            'service_02hek52', //your_service_id
            'template_f6qckle', //your_template_id
            {email: col.email, participant_name: fullname},
            'sOTpCYbD5KllwgbCD' //your_public_key
        )
        .then((result) => {
            console.log("results", result)
            props.closeModal();
        })
        .catch((error) => {
            console.log("trigger error")
            console.log("Error", error)
            props.closeModal();
        });
    });
}

export const onSave = (props) => {
    const col= props.selectedCol
    const data = props.data

    updateItem(data.email, {
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        mobile: data.mobile,
        company: data.company,
        remarks: `${data.remarks} --> /* This data was edited by the sponsor */ <-- ${new Date().toLocaleString()}`
    })
    .then((result) => {
        props.closeModal();
    })
    .catch((error) => {
        props.closeModal();
    });
}

export const onReject = (props) => {
    console.log("props", props)
    updateItem(props.selectedCol.email, {
        reg_status: "canceled",
        remarks: props.data.remarks
    })
    .then(() => {
        emailjs.send(
            'service_02hek52', //your_service_id
            'template_ud9rl9a', //your_template_id
            {
                email: props.selectedCol.email,
                participant_name: `${props.selectedCol.first_name} ${props.selectedCol.last_name}`
            },
            'sOTpCYbD5KllwgbCD' //your_public_key
        )
        .then((result) => {
            props.closeModal();
        })
        .catch((error) => {
            props.closeModal();
        });
    })
}

export const onDelete = (props) => {
    deleteItem(props.selectedCol.id, props.selectedCol.email)
    props.closeModal()
}

export const inviteEmail = (props) => {
     emailjs.send(
        'service_02hek52', //your_service_id
        'template_qiflphb', //your_template_id
        {email: props.email},
        'sOTpCYbD5KllwgbCD' //your_public_key
    )
    .then((result) => {
        props.closeModal();
    })
    .catch((error) => {
        props.closeModal();
    });
}