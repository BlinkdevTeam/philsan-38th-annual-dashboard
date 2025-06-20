import qrBackground from "../../assets/qr-background.png"
import { getParticipant } from "../../supabase/supabaseService";
import { useNavigate } from "react-router-dom";
import React, { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

const QrCode = () => {
    const params = new URLSearchParams(window.location.search);
    const eValue = params.get('e');
    const navigate = useNavigate();
    console.log(eValue);


    const elementRef = useRef();

    console.log("elemref", elementRef.current)

    useEffect(() => {
        getParticipant(eValue).then((res) => {
            if(res) {
                console.log(res)
                handleDownload()
            } else {
                handleNavigation
            }
        })
    }, [])

    const handleDownload = async () => {
        const canvas = await html2canvas(elementRef.current);
        const dataUrl = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `my-philsan-38th-annual-convetion-qr-${eValue}.png`;
        link.click();
    };

    const handleNavigation = () => {
        navigate("https://philsan.org/38th-annual-convention/registration/")
    }

    return (
        <>
        {
            eValue ?

            <div className="">
                <div className="h-screen w-screen overflow-hidden absolute z-[-1]">
                    <img className="w-full h-full object-cover" src={qrBackground} alt="" />
                </div>
                <div className="flex h-[100vh] justify-center items-center">
                    <div
                        ref={elementRef}
                        className="relative w-[400px] h-[740px] rounded-xl overflow-hidden bg-white shadow-xl"
                    >
                        {/* ✅ Background Image */}
                        <img
                        src="https://shvutlcgljqiidqxqrru.supabase.co/storage/v1/object/public/philsan-email-assets//ticket_bg.png"
                        className="absolute top-0 left-0 w-full h-full object-cover z-0"
                        alt="Background"
                        />

                        {/* ✅ Foreground Content */}
                        <div className="relative z-10 w-full h-full flex flex-col items-center text-center p-[20px] justify-start">
                        <div className="w-[150px] mb-6">
                            <img
                            src="https://shvutlcgljqiidqxqrru.supabase.co/storage/v1/object/public/philsan-email-assets//convention-logo.png"
                            alt="Convention Logo"
                            className="w-full h-auto"
                            />
                        </div>

                        <div className="flex flex-col gap-4 mb-4">
                            <p className="text-[14px] font-bold">
                            Innovating for a Sustainable Future: Harnessing Technology and Alternative Solutions in Animal Nutrition and Health
                            </p>
                            <p className="text-[22px] font-bold text-[#1F773A] fraunces">September 30, 2025</p>

                            <div className="bg-gradient-to-r from-[#1F773A] to-[#EDB221] text-white px-4 py-2 rounded-tl-[40px] rounded-br-[40px]">
                            <p className="text-[16px] fraunces">Okada Manila Paranaque City,</p>
                            <p className="text-[16px] fraunces">Philippines</p>
                            </div>
                        </div>

                        {/* ✅ QR Code */}
                        <div className="bg-white p-[10px] rounded-xl mb-4">
                            <img
                            className="w-[200px] h-[200px]"
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}`}
                            alt="QR Code"
                            />
                        </div>

                        {/* ✅ Sponsors Image */}
                        <div className="w-full mt-auto">
                            <img
                            src="https://shvutlcgljqiidqxqrru.supabase.co/storage/v1/object/public/philsan-email-assets//Sponsors%20Logo@3x-8%201.png"
                            alt="Sponsors"
                            className="w-full"
                            />
                        </div>
                        </div>

                        {/* ✅ Decorative Bottom Background */}
                        <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
                        <img
                            src="https://shvutlcgljqiidqxqrru.supabase.co/storage/v1/object/public/philsan-email-assets//Philsan%20Ticket%20BG@3x-8%201.png"
                            alt="Decorative BG"
                            className="w-full object-cover opacity-50"
                        />
                        </div>
                    </div>
                </div>
            </div> :
            {
                handleNavigation
            }
        }
        </>
    )
}

export default QrCode