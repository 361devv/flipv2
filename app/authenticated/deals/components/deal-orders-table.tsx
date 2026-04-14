"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Deal } from "../data/schema";

const formatNumber = (num: number) => num.toLocaleString();
const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};

interface DealOrdersTableProps {
  deal: Deal;
}

export const DealOrdersTable = ({ deal }: DealOrdersTableProps) => {
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });

  const renderRow = (
    type: "Sell Order" | "Buy Order",
    order: Deal["sellOrder"] | Deal["buyOrder"],
    imgId: string
  ) => (
    <TableRow
      onMouseEnter={() => setPreviewImg(`https://render.albiononline.com/v1/item/${imgId}.png`)}
      onMouseLeave={() => setPreviewImg(null)}
      onMouseMove={handleMouseMove}
    >
      <TableCell className="font-medium">{type}</TableCell>
      <TableCell>
        {order.enchantmentLevel > 0 ? `Exceptional (${order.enchantmentLevel})` : "None (0)"}
      </TableCell>
      <TableCell>
        {order.qualityLevel === 4 ? "Excellent (4)" : order.qualityLevel === 1 ? "Normal (1)" : `Other (${order.qualityLevel})`}
      </TableCell>
      <TableCell>{formatNumber(order.price)}</TableCell>
      <TableCell>{formatTimeAgo(order.createdAt)}</TableCell>
    </TableRow>
  );

  return (
    <>
      {previewImg && (
        <div
          className="fixed pointer-events-none z-50 bg-background border rounded-lg p-2 shadow-lg"
          style={{ left: mousePos.x + 15, top: mousePos.y + 15 }}
        >
          <img src={previewImg} alt="Preview" className="w-16 h-16 object-contain" />
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Type</TableHead>
            <TableHead>Enchantment</TableHead>
            <TableHead>Quality</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renderRow("Sell Order", deal.sellOrder, deal.sellOrder.itemTypeId)}
          {renderRow("Buy Order", deal.buyOrder, deal.buyOrder.itemTypeId)}
        </TableBody>
      </Table>
    </>
  );
};