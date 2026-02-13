"use client";

import { useMemo, useState } from "react";
import AdvancedSelect from "@/components/AdvancedSelect";

function makeBigData() {
  const groups = ["Fruits", "Vegetables", "Meat", "Dairy", "Seafood", "Grains"];
  const out = [];
  let id = 1;

  for (let g of groups) {
    for (let i = 0; i < 800; i++) {
      out.push({
        id: String(id++),
        label: `${g} item ${i + 1}`,
        group: g,
      });
    }
  }
  return out;
}

export default function AdvancedSelectDemoPage() {
  const items = useMemo(() => makeBigData(), []);
  const [selectedIds, setSelectedIds] = useState([]);

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-semibold mb-2">Advanced Select Demo</h1>
      <p className="text-sm text-gray-600 mb-6">
        Headless UI Listbox + Tailwind + Search + Multi + Grouping + Select all/none + Virtualization
      </p>

      <AdvancedSelect
        items={items}
        value={selectedIds}
        onChange={setSelectedIds}
        placeholder="Pick items..."
        height={360}
        itemSize={40}
      />

      <div className="mt-6 rounded-lg border border-gray-200 p-4 bg-white">
        <div className="text-sm text-gray-700">
          Selected count: <b>{selectedIds.length}</b>
        </div>
        <div className="mt-2 text-xs text-gray-500 wrap-break-word">
          Selected IDs (first 50): {selectedIds.slice(0, 50).join(", ")}
          {selectedIds.length > 50 ? " ..." : ""}
        </div>
      </div>
    </div>
  );
}