import emailjs from "@emailjs/browser";
import { getItems, deleteWithCharaters, updateItem, deleteItem } from '../../../supabase/supabaseService';

export const onApprove = (props) => {
    const col= props.selectedCol
    const data = props.data

    updateItem(data.email, {
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        mobile: data.mobile,
        company: data.company,
        reg_status: "approved"
    })
    .then((res) => {
        const fullname = res[0].first_name + " " + res[0].last_name

        console.log("fullname", fullname)
        emailjs.send(
            'service_1qkyi2i', //your_service_id
            'template_f6qckle', //your_template_id
            {email: col.email, participant_name: fullname},
            'sOTpCYbD5KllwgbCD' //your_public_key
        )
        .then((result) => {
            console.log("results", result)
            props.closeModal();
        })
        .catch((error) => {
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
    })
}

export const onReject = (props) => {
    updateItem(props.selectedCol.email, {reg_status: "canceled"})
    .then(() => {
        emailjs.send(
            'service_1qkyi2i', //your_service_id
            'template_ud9rl9a', //your_template_id
            {email: props.selectedCol.email},
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
    deleteItem(props.selectedCol.email)
    props.closeModal()
}

export const inviteEmail = (props) => {
     emailjs.send(
        'service_1qkyi2i', //your_service_id
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