import PanelPage from "@/layouts/panel"
import {useEffect, useState} from "react";
import EventService, {type Event} from "@/api/services/event-service.ts";
import {
  CalendarClock,
  CalendarIcon,
  ChevronDownIcon, Lightbulb,
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
import MultipleSelector, {type Option} from '@/components/ui/multi-select.tsx'
import {
  Empty, EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Age} from "@/components/age/age.tsx";

function EventListEmpty() {
  const {t} = useTranslation();
  return (
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
  )
}

const types: Option[] = [
  {
    value: 'normal',
    label: 'Normal'
  },
  {
    value: 'warning',
    label: 'Warning',
    color: "text-amber-500"
  },
  {
    value: 'error',
    label: 'Error',
    color: "text-rose-500"
  },
]

export default function EventsPage() {
  const {t} = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedValues, setSelectedValues] = useState<Option[]>([]);
  const [limit, setLimit] = useState("100");
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    async function loadEvents() {
      try {
        const now = Date.now();
        const sixtyMinutesAgo = now - 24 * 60 * 60 * 1000;
        const response = await EventService.list({
          start: startDate?.getTime() || sixtyMinutesAgo,
          end: endDate?.getTime() || now,
          limit: parseInt(limit, 10),
        });
        const filteredEvents = response.events.filter(event => {
          if (selectedValues.length > 0 && !selectedValues.map(v => v.value).includes(event.type.toLowerCase())) {
            return false;
          }
          if (search && !event.message.toLowerCase().includes(search.toLowerCase())) {
            return false;
          }
          return true;
        });
        setEvents(filteredEvents);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
    const interval = setInterval(loadEvents, 1000);
    return () => clearInterval(interval);
  }, [startDate, endDate, limit, selectedValues, search]);

  return (
    <PanelPage title="panel.page.events.title">
      <div className="flex justify-between items-center my-[4vh]">
        <div className='relative'>
          <div
            className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
            <Search className='size-4'/>
          </div>
          <Input
            placeholder={t("table.search")}
            value={search}
            onChange={e => setSearch(String(e.target.value))}
            className="max-w-sm peer pl-9"
          />
        </div>
        <div className="flex items-center gap-4">
          <MultipleSelector
            commandProps={{
              label: t("panel.page.events.status.placeholder")
            }}
            value={selectedValues}
            onChange={setSelectedValues}
            defaultOptions={types}
            prefixIcon={<Lightbulb size={16}/>}
            placeholder={t("panel.page.events.status.placeholder")}
            hideClearAllButton
            hidePlaceholderWhenSelected
            emptyIndicator={<p
              className='text-center text-sm'>{t("panel.page.events.status.empty")}</p>}
            className='dark:bg-input/30'
          />
          <Select value={limit} onValueChange={setLimit}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <SquareArrowDown/>
                <span className="pt-0.5">
                   {t("panel.page.events.limit")}: <SelectValue
                  placeholder="Select a limit"/>
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
                    {startDate
                      ? `${t("panel.page.events.start.label")}: ${startDate.toLocaleDateString()}`
                      : t("panel.page.events.start.placeholder")}
                  </span>
                </div>
                <ChevronDownIcon/>
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
                    {endDate
                      ? `${t("panel.page.events.end.label")}: ${endDate.toLocaleDateString()}`
                      : t("panel.page.events.end.placeholder")}
                  </span>
                </div>
                <ChevronDownIcon/>
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
      {events.length === 0 ? (
        <EventListEmpty/>
      ) : (
        <div className="relative w-full mx-auto">
          <div className="overflow-y-auto flex-1 relative pb-8 pr-2 w-full mx-auto">
            <div className="relative before:absolute before:left-2 before:top-1 before:h-full before:w-0.5 before:bg-primary/20">
              {loading
                ? Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="relative mb-8 flex items-start animate-pulse">
                    <div className="absolute left-[1px] top-1">
                      <div className="rounded-full w-4 h-4 border-2 border-primary/75 bg-sidebar" />
                    </div>
                    <div className="ml-8 w-full">
                      <div className="flex items-center justify-between mb-2 ml-0.5">
                        <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                        <div className="h-3 bg-primary/20 rounded w-16"></div>
                      </div>
                      <div className="h-3 bg-primary/20 rounded w-1/2 text-sm"></div>
                    </div>
                  </div>
                ))
                : [...events]
                  .sort(
                    (a, b) =>
                      new Date(b.first_timestamp).getTime() -
                      new Date(a.first_timestamp).getTime()
                  )
                  .map((event, idx) => {
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
                      <div key={idx} className="relative mb-8 flex items-start">
                        <div className="absolute left-[1px] top-1">
                          <div className="rounded-full w-4 h-4 flex items-center justify-center border-2 border-primary/75 bg-sidebar"></div>
                        </div>
                        <div className={cn("ml-8 w-full", color)}>
                          <div className="flex items-center justify-between mb-2 ml-0.5">
                            <div className="flex items-center gap-3">
                              {icon}
                              <span>
                                {event.message} ({event.type})
                              </span>
                              {event.count > 1 && (
                                <Badge
                                  variant="secondary"
                                  className="h-5 min-w-5 rounded-full px-1 pt-1 font-mono tabular-nums"
                                >
                                  {event.count}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs opacity-70">
                              <Age age={Date.now() - event.first_timestamp}/>
                            </div>
                          </div>
                          <div className={cn("text-sm wrap-anywhere opacity-60", color)}>
                            {event.namespace} / {event.involved_name} ({event.involved_kind})
                          </div>
                        </div>
                      </div>
                    );
                  })
              }
            </div>
          </div>
          <div className="pointer-events-none fixed bottom-0 left-0 w-full h-36 bg-gradient-to-t from-background to-transparent"></div>
        </div>
      )}
    </PanelPage>
  );
}
