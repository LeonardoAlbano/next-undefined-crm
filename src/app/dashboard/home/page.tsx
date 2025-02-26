import TableProjectActive from "@/components/dashboard/home-card/table-project-active";
import TotalClientsCard from "@/components/dashboard/home-card/total-clients-card";
import TotalProjectCard from "@/components/dashboard/home-card/total-project-card";
import TotalValueCard from "@/components/dashboard/home-card/total-value-card";

export default function DashoboardHome() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-5">
        <TotalProjectCard />
        <TotalClientsCard />
        <TotalValueCard />
      </div>

      <div className="rounded-md border">
        <TableProjectActive />
      </div>
    </div>
  );
}
