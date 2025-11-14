"use client";
import useGetMedicalRecords from "@/hooks/useGetMedicalRecords";
import { useMedStore } from "@/providers/med-provider";
import MedicalRecordsDashboardMetrics from "./MedicalRecordsDashboardMetrics";
import MedicalRecordsTable from "../dataTable/MedicalRecordsTable";

const MedicalRecordsBox = () => {
  const { credentials } = useMedStore((store) => store);
  const { data, isLoading, refetch, setDateRange } = useGetMedicalRecords(
    credentials?.databaseId as string
  );
  return (
    <div className="space-y-6">
      <section>
        <MedicalRecordsDashboardMetrics
          data={data?.stats}
          isLoading={isLoading}
        />
      </section>

      <MedicalRecordsTable
        data={data?.records}
        isLoading={isLoading}
        refetch={refetch}
        setNewDateRange={setDateRange}
      />
    </div>
  );
};

export default MedicalRecordsBox;
