'use client';

import { Typography } from "@/lib/mui";
import NewZoneDialog from "./NewZoneDialog";
import { TaskSettings, TaskSettingsZones } from "@/lib/types/task";
import { FaCircleNodes } from "react-icons/fa6";
import TemplateButton from "@/modules/buttons/TemplateButton";

type Props = {
  data: TaskSettingsZones;
  loading: boolean;
  handleChange: (newData: TaskSettings) => void;
};

const EditTaskZoneSettings = ({ data, loading, handleChange }: Props) => (
  <div className="border border-gray-300 rounded-lg p-2">
    <div className="flex items-center justify-between w-full">
      <Typography className="font-semibold">Strefy</Typography>
      <NewZoneDialog loading={loading} otherZones={data.zones} onConfirm={(z) => handleChange({ ...data, zones: [...data.zones, z] })} />
    </div>
    <div className="w-full h-px bg-gray-300 my-2" />
    {!data.zones.length && <Typography className="text-xs text-red-600">Nie zdefiniowano żadnych stref.</Typography>}
    <div className="flex flex-col gap-1">
      {data.zones
        .toSorted((a, b) => a.score - b.score)
        .map((z) => (
          <div key={z.shortName} className="flex items-center justify-between gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <FaCircleNodes className="w-4 h-4 text-pink-600" />
              <Typography className="text-sm">{`${z.name} (${z.shortName}): ${z.score} pkt.`}</Typography>
            </div>
            <TemplateButton
              template="delete"
              disabled={loading}
              onClick={() => handleChange({ ...data, zones: data.zones.filter((v) => v.shortName !== z.shortName) })}
            />
          </div>
        ))}
    </div>
  </div>
);

export default EditTaskZoneSettings;
