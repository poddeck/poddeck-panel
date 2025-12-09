import PanelPage from "@/layouts/panel"
import {useEffect, useState} from "react";
import EventService, {type Event} from "@/api/services/event-service.ts";
import {
  CalendarClock,
  CalendarIcon,
  ChevronDownIcon,
  Search,
  Siren, SquareArrowDown,
  TriangleAlert
} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {useTranslation} from "react-i18next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Calendar} from "@/components/ui/calendar.tsx";
import {cn} from "@/lib/utils.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select.tsx";
import {
  MultiSelect,
  type Option
} from '@/components/ui/multi-select.tsx'
import {
  Empty, EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty.tsx";

function EventListEmpty() {
  const {t} = useTranslation();
  return (
    <PanelPage title="panel.page.events.title">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarClock/>
          </EmptyMedia>
          <EmptyTitle>{t("panel.page.events.empty.title")}</EmptyTitle>
          <EmptyDescription>
            {t("panel.page.events.empty.description")}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </PanelPage>
  )
}

export default function EventsPage() {
  const {t} = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [limit, setLimit] = useState("100");
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const types: Option[] = [
    {
      value: 'normal',
      label: 'Normal'
    },
    {
      value: 'warning',
      label: 'Warning'
    },
    {
      value: 'error',
      label: 'Error'
    },
  ]

  useEffect(() => {
    async function loadEvents() {
      try {
        const now = Date.now();
        const sixtyMinutesAgo = now - 24 * 60 * 60 * 1000;
        const response = await EventService.list({
          start: sixtyMinutesAgo,
          end: now,
          limit: 100,
        });
        setEvents(response.events);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
    const interval = window.setInterval(loadEvents, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  if (!loading && events.length === 0) {
    return <EventListEmpty/>
  }
  return (
    <PanelPage title="panel.page.events.title">
      <div className="flex justify-between items-center my-[4vh]">
        <div className='relative'>
          <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
            <Search className='size-4' />
          </div>
          <Input
            placeholder={t("table.search")}
            value={search}
            onChange={e => setSearch(String(e.target.value))}
            className="max-w-sm peer pl-9"
          />
        </div>
        <div className="flex items-center gap-4">
          <MultiSelect
            options={types}
            onValueChange={setSelectedValues}
            defaultValue={selectedValues}
          />
          <Select value={limit} onValueChange={setLimit}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <SquareArrowDown/>
                <span className="pt-0.5">
                   Limit: <SelectValue placeholder="Select a limit" />
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="1000">1000</SelectItem>
              <SelectItem value="10000">10000</SelectItem>
            </SelectContent>
          </Select>
          <Popover open={openStart} onOpenChange={setOpenStart}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon/>
                  <span className="pt-0.5">
                    {startDate ? "Start: " + startDate.toLocaleDateString() : "Select start"}
                  </span>
                </div>
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="end">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date)
                  setOpenStart(false)
                }}
              />
            </PopoverContent>
          </Popover>
          <Popover open={openEnd} onOpenChange={setOpenEnd}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon/>
                  <span className="pt-0.5">
                    {endDate ? "End: " + endDate.toLocaleDateString() : "Select end"}
                  </span>
                </div>
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="end">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date)
                  setOpenEnd(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="overflow-y-auto flex-1 relative pb-8 pr-2 w-full mx-auto">
        <div className="relative before:absolute before:left-2 before:top-1 before:h-full before:w-0.5 before:bg-primary/20">
          {[...events]
            .sort((a, b) => new Date(b.first_timestamp).getTime() - new Date(a.first_timestamp).getTime())
            .map((event) => {
              let color = "text-primary";
              let icon = null;

              if (event.type.toLowerCase() === "warning") {
                color = "text-amber-500";
                icon = <TriangleAlert size={16} />;
              } else if (event.type.toLowerCase() === "error") {
                color = "text-rose-500";
                icon = <Siren size={16} />;
              }

              return (
                <div
                  key={`${event.namespace}-${event.involved_name}-${event.first_timestamp}`}
                  className="relative mb-8 flex items-start"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[1px] top-1">
                    <div className="rounded-full w-4 h-4 flex items-center justify-center border-2 border-primary/75 bg-sidebar"></div>
                  </div>

                  {/* Event content */}
                  <div className={cn("ml-8 w-full", color)}>
                    <div className="flex items-center justify-between mb-2 ml-0.5">
                      <div className="flex items-center gap-3">
                        {icon}
                        <span>
                    {event.message} ({event.type})
                  </span>
                      </div>
                      <div className="text-xs opacity-70">
                        {new Date(event.first_timestamp).toLocaleTimeString()}
                      </div>
                    </div>

                    <div className={cn("text-sm wrap-anywhere opacity-60", color)}>
                      {event.name}
                    </div>

                    <div className="text-xs opacity-40 mt-1">
                      {event.namespace} / {event.involved_kind}: {event.involved_name}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="pointer-events-none fixed bottom-0 left-0 w-full h-32
        bg-gradient-to-t from-background to-transparent"></div>
    </PanelPage>
  );
}
