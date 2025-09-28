import { PDFViewer } from "@react-pdf/renderer";
import Certificate from "./Certificate";

const CertificateViewer = () => {
  return(
    <PDFViewer style={{ width: "100%", height: "90vh" }}>
      <Certificate participantName="John Doe" />
    </PDFViewer>
    )
}

export default CertificateViewer
