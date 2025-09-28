import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getParticipant } from "../../supabase/supabaseService";
import { Document, Page, Text, View, Image, StyleSheet, PDFDownloadLink, Font } from "@react-pdf/renderer";
import PhilsanLogo from "../../assets/philsan_logo.png";
import TimSign from "../../assets/tim_sign_hi_res.png"
import NoelSign from "../../assets/noel_sign_hi_res.png"
import PhilsanTheme from "../../assets/philsan-38th-theme.png";

// Import font files
import PlayfairRegular from "../../fonts/PlayfairDisplay-Regular.ttf";
import PlayfairItalic from "../../fonts/PlayfairDisplay-Italic-VariableFont_wght.ttf";
import PlayfairDisplayExtraBoldItalic from "../../fonts/PlayfairDisplay-ExtraBoldItalic.ttf";


// Register fonts
Font.register({
  family: "Playfair Display",
  fonts: [
    {
      src: PlayfairRegular,
      fontStyle: "normal",
      fontWeight: 400
    },
    {
      src: PlayfairItalic,
      fontStyle: "italic",
      fontWeight: 400
    },
    {
      src: PlayfairDisplayExtraBoldItalic,
      fontStyle: "italic",
      fontWeight: 800
    },
  ]
});

const Certificate = ({participantName}) => {

  // 1. Define styles
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#fff",
      padding: 40,
    },
    container: {
      border: "2px solid #1f783b",
      padding: 30,
      textAlign: "center",
      borderRadius: 60,
    },
    logo: {
      width: 220,
      marginBottom: 50,
      alignSelf: "center",
    },
    timSign: {
      width: 100,
      alignSelf: "center",
    },
    noelSign: {
      width: 200,
      alignSelf: "center",
      marginBottom: -50,
      marginLeft: -50
    },
    title: {
      fontSize: 42,
      fontWeight: 800,      // ExtraBold
      fontStyle: "italic",
      color: "#1f783b",
      marginBottom: 20,
      fontFamily: "Playfair Display"
    },
    main: {
      fontSize: 24,
      fontWeight: "bold",
    },
    simple: {
      fontSize: 12,
      marginBottom: 20
    },
    subtitle: {
      fontSize: 14,
      marginBottom: 10
    },
    signatures: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingTop: 40
    },

    timSignatureBlock: {
      textAlign: "center",
      marginLeft: 40,
      marginTop: 5
    },

    noelSignatureBlock: {
      textAlign: "center",
    },

    signatureImg: {
      width: 120,
      height: 60,
      objectFit: "contain",
    },
    line: {
      borderBottomWidth: 1,   // thickness
      borderBottomColor: "#000", // color
      marginBottom: 20
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Logo */}
          <Image style={styles.logo} src={PhilsanLogo} />

          {/* Title */}
          <Text style={styles.title}>Certificate</Text>

          {/* Name */}
          <Text style={styles.simple}>Presented to</Text>
          <Text style={styles.main}>{participantName}</Text>
          <View style={styles.line} />

          <Text style={styles.simple}>as</Text>
          <Text style={styles.main}>Convention Participant</Text>
          <View style={styles.line} />

          <Text style={styles.simple}>on the</Text>
          <Text style={{paddingBottom: 5, fontSize: 14}}>Innovating for a Sustainable Future:</Text>
          <Text style={{paddingBottom: 5, fontSize: 14}}>Harnessing Technologies and Alternative Solutions</Text>
          <Text style={{paddingBottom: 30, fontSize: 14}}>in Animal Nutrition and Health</Text>

          
          {/* Subtitle */}
          <Text style={styles.subtitle}>Okada Manila, Parañaque City, Metro Manila, Philippines</Text>
          <View style={styles.line} />

          <Text style={styles.subtitle}>
            September 30, 2025
          </Text>
          <Text style={styles.subtitle}>
            AGR-2023-048
          </Text>
          <Text style={styles.subtitle}>
            3.5 Units
          </Text>

          {/* Signatures */}
          <View style={styles.signatures}>
            <View style={styles.timSignatureBlock}>
              <Image style={styles.timSign} src={TimSign} />
              <Text style={{fontSize: 14}}>Timothy Paolo Bagui</Text>
              <Text style={{fontSize: 14}}>President</Text>
            </View>
            <View style={styles.noelSignignatureBlock}>
              <Image style={styles.noelSign} src={NoelSign} />
              <Text style={{fontSize: 14}}>Noel DLC Salazar</Text>
              <Text style={{fontSize: 14}}>Secretary</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Certificate;
