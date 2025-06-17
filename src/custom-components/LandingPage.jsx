import MainTable from "./table-components/MainTable"
import SponsorMaintable from "./table-components/SponsorMaintable"

const LandingPage = ({sponsor}) => {

    return (
        <>
            {
                sponsor[0].sponsor_name === "Philsan Secretariat" ?
                <MainTable
                    sponsor={sponsor}
                /> : 
                <SponsorMaintable
                    sponsor={sponsor}
                />
            }
        </>
    )
}

export default LandingPage