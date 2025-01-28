import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Leader } from "@/types/database.types";
import { getPercentageColor } from "@/utils/dashboardUtils";

interface LeadershipTableProps {
  data: Leader[];
}

export function LeadershipTable({ data }: LeadershipTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Seq</TableHead>
            <TableHead>Líder</TableHead>
            <TableHead className="text-right">Meta</TableHead>
            <TableHead className="text-right">Inscrições</TableHead>
            <TableHead className="text-right">Percentual</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.leader_id}</TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-right">{item.meta}</TableCell>
              <TableCell className="text-right">{item.completed}</TableCell>
              <TableCell className={`text-right ${getPercentageColor(item.percentage)}`}>
                {item.percentage}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}