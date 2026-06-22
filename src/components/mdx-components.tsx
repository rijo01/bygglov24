import type { ComponentPropsWithoutRef } from "react";
import RegelKort from "@/components/RegelKort";

/**
 * Wrappar alla markdown-tabeller i en horisontellt scrollbar container så att
 * breda tabeller scrollar inuti sin yta på mobil i stället för att spräcka
 * sidlayouten. Påverkar bara <table> från MDX – RegelKort använder inga tabeller.
 */
function MdxTable(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  );
}

/**
 * Komponenter som är anropbara från MDX-innehåll. Skickas som `components`-prop
 * till MDXRemote i åtgärds-, guide- och kommun-mallarna.
 */
export const mdxComponents = {
  RegelKort,
  table: MdxTable,
};
