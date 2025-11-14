import { MedicalRecord } from "../../types/appwrite"

export type TMedicalRecordResonse = {
    stats: {total: number, active: number, doctorsVisited: number, lastVisit: string}
    records: MedicalRecord[]
}