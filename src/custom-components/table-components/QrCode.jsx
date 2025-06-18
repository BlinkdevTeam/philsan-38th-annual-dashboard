import qrBackground from "../../assets/qr-background.png"

const QrCode = () => {
    return (
        <div className="relative block">
            <div className="h-screen w-screen overflow-hidden absolute z-[-1]">
                <img className="w-full h-full object-cover" src={qrBackground} alt="" />
            </div>
            <div className="flex h-[100vh] justify-center items-center">
                <div className="shadow-lg p-[20px]">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-[200px]">
                            <img src="https://shvutlcgljqiidqxqrru.supabase.co/storage/v1/object/public/philsan-email-assets//convention-logo.png" alt="" />
                        </div>
                        <p>Innovating for a Sustainable Future: Harnessing<br/> Technology and Alternative Solutions in Animal<br/> Nutrition and Health</p>
                        <p>SEPTEMBER 30, 2025</p>
                        <p>Okada Manila, Paranaque City, Philippines</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QrCode