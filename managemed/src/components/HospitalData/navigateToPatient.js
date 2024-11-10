import { setCurrentPage, setPatientID1} from "./HospitalData";
export const navigateToPatient = (hospitalID, levelID, roomID, patientID) => {
    // Here we would set the current page to "patient" and set the selected patientID1
    setCurrentPage("patient");
    setPatientID1(patientID);
}