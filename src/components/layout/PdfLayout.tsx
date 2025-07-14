/* eslint-disable jsx-a11y/alt-text */
"use client";
import { Page, View, Document, Text, Image } from "@react-pdf/renderer";
import { styles } from "../pdfTemplates/style";

// Create Document Component

const PdfLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.watermarkContainer} fixed>
          <Text style={styles.watermarkText}>CONFIDENTIAL</Text>
        </View>
        <View style={styles.stampBox} fixed>
          <Image
            src={
              "https://fra.cloud.appwrite.io/v1/storage/buckets/684c089700291c6d4e3e/files/686d279c0018d9a4963a/view?project=684b3c5600261b4fa7ca&mode=admin"
            }
            style={styles.stamp}
          />
        </View>
        <View style={styles.section}>{children}</View>
        {/* <View style={styles.section}>
        <Text>Section #2</Text>
      </View> */}
      </Page>
    </Document>
  );
};

export default PdfLayout;
