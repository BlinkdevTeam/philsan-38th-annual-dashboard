export const uploadProof = (props) => {
    if (props.selectedCol) {
        const filePath = `${props.selectedCol.payment}`; // assuming this is your full path
        const { data, error } = props.supabase
            .storage
            .from(props.bucket)
            .getPublicUrl(filePath);

        if (error) {
            console.error('Error fetching public URL:', error);
        } else {
            props.setProof(data.publicUrl);
        }
    }
}