"use client"

import {Input} from "@/components/ui/input"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {CLUSTER_ICON_LIST} from "./icon-list";

export default function ClusterIconSelect({ value, onChange }: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  const {t} = useTranslation();
  const [search, setSearch] = useState("");
  const defaultSelected = CLUSTER_ICON_LIST.filter((entry) => entry.id === value);
  const [selected, setSelected] = useState(defaultSelected.length > 0 ? defaultSelected[0] : null);
  const filtered = CLUSTER_ICON_LIST.filter((entry) =>
    entry.id === selected?.id || t(entry.label).toLowerCase().includes(search.toLowerCase())
  );
  const handleChange = (selected: string) => {
    setSelected(CLUSTER_ICON_LIST.filter((entry) => entry.id === selected)[0]);
    onChange?.(selected);
  };
  return (
    <div className="space-y-4 w-full max-w-md">
      <Select value={selected ? selected.id : ""} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("panel.sidebar.cluster.icon.select.placeholder")} />
        </SelectTrigger>
        <SelectContent className="w-94">
          <div className="p-2">
            <Input
              placeholder={t("panel.sidebar.cluster.icon.input.placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 p-2">
            {filtered.map((entry) => (
              <SelectItem
                key={entry.id}
                value={entry.id}
              >
                <entry.icon size={24} />
                <span className="text-xs">{t(entry.label)}</span>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}