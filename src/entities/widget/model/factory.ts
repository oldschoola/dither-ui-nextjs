import type { AvatarModel, ButtonModel, GradientModel, ImageModel, WidgetKind, WidgetModel } from "./types"

export function createWidget(kind: WidgetKind): WidgetModel {
  switch (kind) {
    case "avatar":
      return {
        kind: "avatar",
        name: "Ada Lovelace",
        autoColor: true,
        color: "#358ff3",
        mirror: "auto",
        grid: 8,
        cellPx: 4,
        density: 0,
        offTier: 0.35,
        bloom: "off",
        animate: true,
        animationDuration: 600,
      } satisfies AvatarModel
    case "button":
      return {
        kind: "button",
        label: "Click me",
        color: "blue",
        variant: "gradient",
        cell: 2,
        bloom: "off",
      } satisfies ButtonModel
    case "image":
      return {
        kind: "image",
        // Inline SVG placeholder so a fresh frame renders offline; paste any URL.
        src:
          "data:image/svg+xml," +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#358ff3"/><stop offset="1" stop-color="#f05abe"/></linearGradient></defs><rect width="320" height="240" fill="url(#g)"/></svg>'
          ),
        alt: "",
        cell: 3,
        focusY: 0.5,
        fade: 0,
      } satisfies ImageModel
    case "gradient":
      return {
        kind: "gradient",
        from: "blue",
        twoTone: false,
        to: "pink",
        direction: "up",
        cell: 3,
        opacity: 1,
        bloom: "off",
      } satisfies GradientModel
  }
}
