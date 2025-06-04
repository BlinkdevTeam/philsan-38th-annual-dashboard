const realTime = (props) => {
    if (!props.sponsor) return;
    
    const fetchData = async () => {
        try {
        if (props.sponsor.name === "Philsan Secretariat") {
            setApproved(await getApproved());
            setPendings(await getPendings());
            setCanceled(await getCanceled());
            setVerified(await getVerified());
        } else {
            setApproved(await getSponsorsApproved({ sponsor: props.sponsor.name }));
            setPendings(await getSponsorsPendings({ sponsor: props.sponsor.name }));
        }
        } catch (err) {
        console.error("Fetch error:", err);
        }
    };

    fetchData();

    const channel = supabase
        .channel("realtime:philsan_registration_2025")
        .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "philsan_registration_2025",
        },
        (payload) => {
            console.log("🔁 Realtime payload:", payload);

            const { new: newData } = payload;

            // Only update if this is the same sponsor
            const isRelevant =
            props.sponsor.name === "Philsan Secretariat" ||
            newData.sponsor === props.sponsor.name;

            if (!isRelevant) return;

            updateByStatus(newData);
        }
        )
        .subscribe();

    const updateByStatus = (data) => {
        const updateState = (setter) => {
            setter((prev) => {
                const exists = prev.find((item) => item.id === data.id);
                return exists
                ? prev.map((item) => (item.id === data.id ? data : item))
                : [data, ...prev];
            });
        };

        switch (data.reg_status) {
        case "pending":
            updateState(props.setPendings);
            break;
        case "verified":
            updateState(props.setVerified);
            break;
        case "canceled":
            updateState(props.setCanceled);
            break;
        case null:
            updateState(props.setApproved);
            break;
        }
    };

    return () => {
        supabase.removeChannel(channel);
    };
}

export default realTime;