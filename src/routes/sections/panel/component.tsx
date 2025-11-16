import * as React from "react";
import { lazy } from "react";

export type PageComponent = React.ComponentType<Record<string, unknown>>;

const Pages = import.meta.glob("/src/pages/**/*.tsx") as Record<
  string,
  () => Promise<{ default: PageComponent }>
>;

const lazyComponentCache = new Map<string, React.LazyExoticComponent<PageComponent>>();

export const Component = (
  path = "",
  props?: Record<string, unknown>
): React.ReactNode => {
  if (!path) return null;

  const importFn = Pages[`/src${path}.tsx`] ?? Pages[`/src${path}/index.tsx`];

  if (!importFn) {
    console.warn("Component not found for path:", path);
    return null;
  }

  let Element = lazyComponentCache.get(path);
  if (!Element) {
    Element = lazy(importFn);
    lazyComponentCache.set(path, Element);
  }

  return React.createElement(Element, props ?? {});
};
