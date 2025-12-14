"use client"

import {useTranslation} from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import {Globe, type GlobeMarker} from "@/components/ui/globe.tsx";
import {MapPin} from "lucide-react";
import {useMemo} from "react";

export default function OverviewLocationBox() {
  const {t} = useTranslation();
  const markers: GlobeMarker[] = useMemo(() => [
    { location: [52.5200, 13.4050], size: 0.1 },
  ], []);
  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle className="flex gap-2">
          <MapPin size={18} className="-translate-y-0.5"/> {t("panel.page.overview.location.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="w-fit h-fit">
        <Globe markers={markers}/>
      </CardContent>
    </Card>
  )
}