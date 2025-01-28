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
            {data.map((item) => (
              <TableRow 
                key={item.id}
                className={item.percentage >= 100 ? "bg-green-500" : ""}
              >
                <TableCell className={item.percentage >= 100 ? "text-black" : ""}>{item.leader_id}</TableCell>
                <TableCell className={`font-medium ${item.percentage >= 100 ? "text-black" : ""}`}>{item.name}</TableCell>
                <TableCell className={`text-right ${item.percentage >= 100 ? "text-black" : ""}`}>{item.meta}</TableCell>
                <TableCell className={`text-right ${item.percentage >= 100 ? "text-black" : ""}`}>{item.completed}</TableCell>
                <TableCell className={`text-right ${item.percentage >= 100 ? "text-black font-bold" : getPercentageColor(item.percentage)}`}>
                  {item.percentage}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}