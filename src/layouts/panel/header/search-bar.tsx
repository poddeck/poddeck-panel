import {useRouter} from "@/routes/hooks";
import {Button} from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem, CommandList, CommandSeparator
} from "@/components/ui/command";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useBoolean} from "react-use";
import {useTranslation} from "react-i18next";
import {ArrowDown, ArrowUp, CornerDownLeft, Search} from "lucide-react";
import {AppNavigation} from "@/layouts/panel/sidebar/app-sidebar";
import {Badge} from "@/components/ui/badge";

interface SearchItem {
  key: string;
  label: string;
  path: string;
}

const HighlightText = ({text, query}: { text: string; query: string }) => {
  if (!query) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="text-primary">
						{part}
					</span>
        ) : (
          part
        ),
      )}
    </>
  );
};

export function HeaderSearchBar() {
  const {t} = useTranslation();
  const {replace} = useRouter();
  const [open, setOpen] = useBoolean(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = AppNavigation();

  const flattenedItems = useMemo(() => {
    const items: SearchItem[] = [];

    const flattenItems = (navItems: typeof navigation) => {
      for (const section of navItems) {
        if (section.items.length == 0) {
          items.push({
            key: section.url!,
            label: section.title,
            path: section.url!,
          });
        }
        for (const item of section.items) {
          if (item.title) {
            items.push({
              key: item.url,
              label: item.title,
              path: item.url,
            });
          }
        }
      }
    };

    flattenItems(navigation);
    return items;
  }, [navigation]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open: boolean) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const handleSelect = useCallback(
    (path: string) => {
      replace(path);
      setOpen(false);
    },
    [replace, setOpen],
  );

  return (
    <>
      <Button variant="ghost"
              className="bg-secondary px-2 rounded-lg mr-0 hidden md:block"
              size="sm" onClick={() => setOpen(true)}>
        <div className="flex items-center justify-center gap-4">
          <Search size="20"/>
          <span
            className="mr-10">{t("panel.header.search.placeholder")}</span>
          <kbd
            className="flex items-center justify-center rounded-md bg-primary/20 text-common-white px-1.5 py-0.5 text-sm font-extralight">
            <span>{t("panel.header.search.ctrl")} K</span>
          </kbd>
        </div>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t("panel.header.search.popup.placeholder")}
                      value={searchQuery} onValueChange={setSearchQuery}
                      className="focus:outline-none focus:ring-0 focus-visible:ring-0 border-0"/>
        <CommandList>
          <CommandEmpty>{t("panel.header.search.empty")}</CommandEmpty>
          <CommandGroup heading={t("panel.header.search.popup.heading")}>
            {flattenedItems.map(({key, label}) => (
              <CommandItem
                key={key}
                onSelect={() => handleSelect(key)}
                className="flex flex-col items-start"
              >
                <div className="font-medium">
                  <HighlightText text={label} query={searchQuery}/>
                </div>
                <div className="text-xs text-muted-foreground">
                  <HighlightText text={key} query={searchQuery}/>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
        <CommandSeparator/>
        <div className="flex flex-wrap text-text-primary p-2 justify-end gap-2">
          <div className="flex items-center gap-1">
            <Badge variant="secondary"><ArrowUp/></Badge>
            <Badge variant="secondary"><ArrowDown/></Badge>
            <span
              className="text-[12px]">{t("panel.header.search.popup.navigate")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="secondary"><CornerDownLeft/></Badge>
            <span
              className="text-[12px]">{t("panel.header.search.popup.select")}</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="secondary">ESC</Badge>
            <span
              className="text-[12px]">{t("panel.header.search.popup.close")}</span>
          </div>
        </div>
      </CommandDialog>
    </>
  );
};