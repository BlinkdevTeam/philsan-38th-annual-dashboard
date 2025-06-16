import MainTable from "./table-components/MainTable"

const LandingPage = ({sponsor}) => {

    return (
        <>
            {
                sponsor[0].sponsor_name === "Philsan Secretariat" ?
                <MainTable
                    sponsor={sponsor}
                /> :
                <></>
            }
        </>
    )
}

export default LandingPage