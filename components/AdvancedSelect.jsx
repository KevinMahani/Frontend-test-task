"use client";

import { Fragment, useMemo, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdvancedSelect({
  items = [],
  value = [],
  onChange,
  placeholder = "Select items...",
  height = 320,
  itemSize = 40,
}) {
  const [query, setQuery] = useState("");

  const byId = useMemo(() => {
    const m = new Map();
    for (const it of items) m.set(it.id, it);
    return m;
  }, [items]);

  const selectedItems = useMemo(() => {
    return value.map((id) => byId.get(id)).filter(Boolean);
  }, [value, byId]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => it.label.toLowerCase().includes(q));
  }, [items, query]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const it of filteredItems) {
      const g = it.group || "Others";
      if (!map.has(g)) map.set(g, []);
      map.get(g).push(it);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredItems]);

  const filteredIds = useMemo(() => filteredItems.map((x) => x.id), [filteredItems]);

  const allFilteredSelected = useMemo(() => {
    if (filteredIds.length === 0) return false;
    return filteredIds.every((id) => value.includes(id));
  }, [filteredIds, value]);

  const toggleSelectAllFiltered = () => {
    if (filteredIds.length === 0) return;

    if (allFilteredSelected) {
      // remove filtered
      const next = value.filter((id) => !filteredIds.includes(id));
      onChange(next);
    } else {
      // add filtered
      const set = new Set(value);
      for (const id of filteredIds) set.add(id);
      onChange(Array.from(set));
    }
  };

  const clearAll = () => onChange([]);

  const removeOne = (id) => {
    onChange(value.filter((x) => x !== id));
  };

  const groupIdsMap = useMemo(() => {
    const map = new Map();
    for (const [groupName, arr] of grouped) {
      map.set(groupName, arr.map((x) => x.id));
    }
    return map;
  }, [grouped]);

  const isGroupAllSelected = (groupName) => {
    const ids = groupIdsMap.get(groupName) || [];
    if (ids.length === 0) return false;
    return ids.every((id) => value.includes(id));
  };

  const toggleGroup = (groupName) => {
    const ids = groupIdsMap.get(groupName) || [];
    if (ids.length === 0) return;

    const allSelected = ids.every((id) => value.includes(id));
    if (allSelected) {
      // remove those ids
      const next = value.filter((id) => !ids.includes(id));
      onChange(next);
    } else {
      // add those ids
      const set = new Set(value);
      for (const id of ids) set.add(id);
      onChange(Array.from(set));
    }
  };

  const rows = useMemo(() => {
    const out = [];
    for (const [groupName, arr] of grouped) {
      out.push({
        type: "header",
        key: `h-${groupName}`,
        label: groupName,
      });
      for (const it of arr) {
        out.push({
          type: "item",
          key: `i-${it.id}`,
          item: it,
        });
      }
    }
    return out;
  }, [grouped]);

  const selectedCount = value.length;

  const buttonLabel = useMemo(() => {
    if (selectedCount === 0) return placeholder;
    return `${selectedCount} selected`;
  }, [selectedCount, placeholder]);

  const Row = ({ index, style }) => {
    const row = rows[index];

    if (row.type === "header") {
      const groupName = row.label;
      const allSel = isGroupAllSelected(groupName);

      return (
        <div
          style={style}
          className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 flex items-center justify-between"
        >
          <span className="truncate">{groupName}</span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleGroup(groupName);
            }}
            className="text-[11px] font-medium text-indigo-700 hover:underline"
            title="Select all/none in this group (filtered)"
          >
            {allSel ? "None" : "All"}
          </button>
        </div>
      );
    }

    const it = row.item;
    const isSelected = value.includes(it.id);

    return (
      <Listbox.Option key={row.key} value={it.id} as={Fragment}>
        {({ active, selected }) => (
          <div
            style={style}
            className={cx(
              "px-3 flex items-center justify-between cursor-pointer select-none",
              active ? "bg-indigo-50" : "bg-white"
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={cx(
                  "inline-flex h-4 w-4 items-center justify-center rounded border",
                  (selected || isSelected) ? "bg-indigo-600 border-indigo-600" : "border-gray-300"
                )}
              >
                {(selected || isSelected) ? (
                  <span className="block h-2 w-2 rounded-sm bg-white" />
                ) : null}
              </span>

              <span className={cx("truncate", (selected || isSelected) ? "font-medium" : "")}>
                {it.label}
              </span>
            </div>

            <span className="text-xs text-gray-400 ml-3">{it.id}</span>
          </div>
        )}
      </Listbox.Option>
    );
  };

  return (
    <div className="w-full">
      {/* Selected chips */}
      <div className="mb-2 flex flex-wrap gap-2">
        {selectedItems.length === 0 ? (
          <span className="text-xs text-gray-500">No items selected.</span>
        ) : (
          <>
            {selectedItems.slice(0, 12).map((it) => (
              <span
                key={it.id}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs"
              >
                <span className="max-w-45 truncate">{it.label}</span>
                <button
                  type="button"
                  onClick={() => removeOne(it.id)}
                  className="text-gray-400 hover:text-gray-700"
                  aria-label={`Remove ${it.label}`}
                  title="Remove"
                >
                  ✕
                </button>
              </span>
            ))}
            {selectedItems.length > 12 ? (
              <span className="text-xs text-gray-500 self-center">
                +{selectedItems.length - 12} more
              </span>
            ) : null}

            <button
              type="button"
              onClick={clearAll}
              className="ml-auto text-xs text-indigo-700 hover:underline"
              title="Clear all selections"
            >
              Clear all
            </button>
          </>
        )}
      </div>

      <Listbox value={value} onChange={onChange} multiple>
        <div className="relative">
          <Listbox.Button
            className={cx(
              "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-left",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500"
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span className={cx("truncate", selectedCount === 0 ? "text-gray-400" : "text-gray-900")}>
                {buttonLabel}
              </span>
              <span className="text-gray-400">▾</span>
            </div>
          </Listbox.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Listbox.Options
              className={cx(
                "absolute z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg",
                "focus:outline-none"
              )}
            >
              {/* Toolbar */}
              <div className="p-3 border-b border-gray-100 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={toggleSelectAllFiltered}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                    title="Select all/none (filtered)"
                  >
                    {allFilteredSelected ? "None" : "All"}
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                    title="Clear all"
                  >
                    Clear
                  </button>
                </div>

                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                  <span>
                    Showing: <b>{filteredItems.length}</b>
                  </span>
                  <span>
                    Selected: <b>{selectedCount}</b>
                  </span>
                </div>
              </div>

              {/* Virtualized list */}
              <div className="bg-white">
                {rows.length === 0 ? (
                  <div className="p-6 text-sm text-gray-500">No results.</div>
                ) : (
<div
  className="overflow-y-auto"
  style={{ maxHeight: height }}
>
  {rows.length === 0 ? (
    <div className="p-6 text-sm text-gray-500">No results.</div>
  ) : (
    rows.map((row) => {
      if (row.type === "header") {
        const groupName = row.label;
        const allSel = isGroupAllSelected(groupName);

        return (
          <div
            key={row.key}
            className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 flex items-center justify-between"
          >
            <span>{groupName}</span>
            <button
              type="button"
              onClick={() => toggleGroup(groupName)}
              className="text-[11px] font-medium text-indigo-700 hover:underline"
            >
              {allSel ? "None" : "All"}
            </button>
          </div>
        );
      }

      const it = row.item;
      const isSelected = value.includes(it.id);

      return (
        <Listbox.Option key={row.key} value={it.id} as={Fragment}>
          {({ active, selected }) => (
            <div
              className={cx(
                "px-3 py-2 flex items-center justify-between cursor-pointer select-none",
                active ? "bg-indigo-50" : "bg-white"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cx(
                    "inline-flex h-4 w-4 items-center justify-center rounded border",
                    (selected || isSelected)
                      ? "bg-indigo-600 border-indigo-600"
                      : "border-gray-300"
                  )}
                >
                  {(selected || isSelected) && (
                    <span className="block h-2 w-2 rounded-sm bg-white" />
                  )}
                </span>

                <span
                  className={cx(
                    (selected || isSelected) ? "font-medium" : ""
                  )}
                >
                  {it.label}
                </span>
              </div>

              <span className="text-xs text-gray-400 ml-3">{it.id}</span>
            </div>
          )}
        </Listbox.Option>
      );
    })
  )}
</div>
                )}
              </div>
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}