/**
 * draw.io embed protocol message types and helpers.
 * Protocol docs: https://www.drawio.com/doc/faq/embed-mode
 */

export interface DrawioMessage {
  event?: string;
  action?: string;
  xml?: string;
  data?: string;
  format?: string;
  exit?: boolean;
  autosave?: number;
  modified?: boolean;
}

export interface DrawioLoadAction {
  action: "load";
  xml: string;
  autosave: 1;
}

export interface DrawioExportAction {
  action: "export";
  format: "svg" | "png" | "xmlsvg" | "xmlpng";
  spinKey?: string;
}

export interface DrawioConfigureAction {
  action: "configure";
  config: {
    darkColor?: string;
    lightColor?: string;
    css?: string;
  };
}

export function createLoadMessage(xml: string): DrawioLoadAction {
  return {
    action: "load",
    xml,
    autosave: 1,
  };
}

export function createExportMessage(
  format: "svg" | "png"
): DrawioExportAction {
  return {
    action: "export",
    format: format === "svg" ? "xmlsvg" : "xmlpng",
  };
}

export function createConfigureMessage(
  isDark: boolean
): DrawioConfigureAction {
  return {
    action: "configure",
    config: {
      darkColor: isDark ? "#1e1e1e" : undefined,
      lightColor: isDark ? undefined : "#ffffff",
    },
  };
}
