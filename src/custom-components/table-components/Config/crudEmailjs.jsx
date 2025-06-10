import emailjs from "@emailjs/browser";
import { getItems, deleteWithCharaters, getApproved, getPendings, getCanceled, getVerified, getSponsorsApproved, getSponsorsPendings, updateItem, deleteItem } from '../../../supabase/supabaseService';

export const onApprove = (props) => {
        updateItem(props.selectedCol.email, {reg_status: "approved"})
        .then(() => {
            emailjs.send(
                'service_1qkyi2i', //your_service_id
                'template_f6qckle', //your_template_id
                {email: props.selectedCol.email},
                'sOTpCYbD5KllwgbCD' //your_public_key
            )
            .then((result) => {
                props.closeModal();
            })
            .catch((error) => {
                props.closeModal();
            });
        });
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
    // console.log(selectedCol)
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