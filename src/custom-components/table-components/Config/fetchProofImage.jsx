export const fetchProofImage = (props) => {
    if (props.selectedCol && props.selectedCol.payment) {
        const filePath = `${props.selectedCol.payment}`; 
        const { data, error } = props.supabase
            .storage
            .from(props.bucket)
            .getPublicUrl(filePath);

        if (error) {
            console.error('Error fetching public URL:', error);
        } else {
            props.setProof(data.publicUrl);
        }
    } else {
        props.setProof(null);
    }
}