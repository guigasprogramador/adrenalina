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
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import * as htmlToImage from 'html-to-image';
import { toast } from "sonner";
import React from 'react';

interface LeadershipTableProps {
  data: Leader[];
}

export function LeadershipTable({ data }: LeadershipTableProps) {
  const tableRef = React.useRef<HTMLDivElement>(null);

  // Ordenar os dados por leader_id
  const sortedData = React.useMemo(() => {
    console.log('Sorting data:', data.length, 'items');
    return [...data].sort((a, b) => {
      const aId = Number(a.leader_id);
      const bId = Number(b.leader_id);
      return aId - bId;
    });
  }, [data]);

  // Calcular totais
  const totals = React.useMemo(() => {
    console.log('Calculating totals for', data.length, 'items');
    return data.reduce((acc, item) => {
      return {
        meta: acc.meta + Number(item.meta),
        completed: acc.completed + Number(item.completed)
      };
    }, { meta: 0, completed: 0 });
  }, [data]);

  const totalPercentage = Math.round((totals.completed / totals.meta) * 100) || 0;

  // Log quando os dados mudam
  React.useEffect(() => {
    console.log('LeadershipTable received new data:', data.length, 'items');
  }, [data]);

  const captureScreenshot = async () => {
    if (tableRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(tableRef.current, {
          quality: 1.0,
          backgroundColor: 'white',
          pixelRatio: 2,
          style: {
            margin: '20px'
          }
        });
        
        // Criar um link temporário para download
        const link = document.createElement('a');
        link.download = 'Arena-Xperience-2025.png';
        link.href = dataUrl;
        link.click();
        
        toast.success('Screenshot salvo com sucesso!');
      } catch (error) {
        console.error('Erro ao capturar screenshot:', error);
        toast.error('Erro ao salvar screenshot');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={captureScreenshot}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Salvar Screenshot
        </Button>
      </div>
      
      <div ref={tableRef} className="rounded-md border bg-white p-4">
        <Table>
          <TableHeader className="bg-black">
            <TableRow>
              <TableHead className="text-green-500">Seq</TableHead>
              <TableHead className="text-green-500">Líder</TableHead>
              <TableHead className="text-green-500 text-right">Meta</TableHead>
              <TableHead className="text-green-500 text-right">Inscrições</TableHead>
              <TableHead className="text-green-500 text-right">Percentual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => {
              console.log('Rendering row for:', item.name, 'completed:', item.completed);
              return (
                <TableRow 
                  key={item.id}
                  className={Number(item.percentage) >= 100 ? "bg-green-500" : ""}
                >
                  <TableCell className={Number(item.percentage) >= 100 ? "text-black" : ""}>{item.leader_id}</TableCell>
                  <TableCell className={`font-medium ${Number(item.percentage) >= 100 ? "text-black" : ""}`}>{item.name}</TableCell>
                  <TableCell className={`text-right ${Number(item.percentage) >= 100 ? "text-black" : ""}`}>{item.meta}</TableCell>
                  <TableCell className={`text-right ${Number(item.percentage) >= 100 ? "text-black" : ""}`}>{item.completed}</TableCell>
                  <TableCell className={`text-right ${Number(item.percentage) >= 100 ? "text-black font-bold" : getPercentageColor(Number(item.percentage))}`}>
                    {item.percentage}%
                  </TableCell>
                </TableRow>
              );
            })}
            {/* Linha de totais */}
            <TableRow className="font-bold bg-gray-100">
              <TableCell>Total</TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">{totals.meta}</TableCell>
              <TableCell className="text-right">{totals.completed}</TableCell>
              <TableCell className={`text-right ${totalPercentage >= 100 ? "text-green-500" : getPercentageColor(totalPercentage)}`}>
                {totalPercentage}%
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}