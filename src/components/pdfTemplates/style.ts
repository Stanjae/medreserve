import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    marginBottom: 20,
    flexDirection: "row",
  },
  title: {
    fontSize: 29,
    fontWeight: "800",
    color: "#283779",
    marginLeft: "10px",
  },
  stamp: {
    width: 100,
    height: 100,
      transform: "rotate(-45deg) translate(-50%, -50%)",
    opacity: 0.75,
  },
  stampBox: {
    position: "absolute",
    top: "75%",
    right: "5%",
  },
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  watermarkContainer: {
    position: "absolute",
    top: "25%",
    left: "25%",
    width: 450,
    height: 450,
    opacity: 0.1, // Adjust transparency
    zIndex: 0,
    transform: "rotate(-45deg) translate(-50%, -50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  watermarkText: {
    fontSize: 60,
    color: "#000",
    fontWeight: "bold",
    opacity: 0.2,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  /* for booking receipt */
  logo: {
    width: 80,
    height: 40,
  },
  divider: {
    color: "#b2dded",
    backgroundColor: "#b2dded",
    height: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  heading: {
    fontSize: "24px",
    textTransform: "capitalize",
    fontWeight: 700,
    lineHeight: "34px",
    marginTop: 0,
    marginBottom: 4,
    color: "#283779",
  },
  description: {
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "20px",
    marginTop: "4px",
    marginBottom: "16px",
    color: "#5e616c",
  },
  flex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: "6px",
    marginTop: "6px",
  },
  label: {
    fontSize: "18px",
    fontWeight: 600,
    lineHeight: "22px",
    color: "#5e616c",
  },
  value: {
    fontSize: "18px",
    fontWeight: 600,
    lineHeight: "22px",
    color: "#283779",
    textTransform: "capitalize",
  },
  divider2: {
    borderBottom: "2px dotted #b2dded",
  },
  margin: {
    marginTop: 10,
    marginBottom: 10,
  },
});
