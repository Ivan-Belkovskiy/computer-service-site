'use client';

import { ReactNode } from "react";
import ControlPanelNavigation from "./ControlPanel/ControlPanelNavigation/ControlPanelNavigation";
import { ControlPanelProvider } from "@/context/ControlPanelContext";

export default function ControlPanelLayout({ children, settings }: { children?: ReactNode; settings: Record<string, string> }) {
  return (
    <ControlPanelProvider>
      <ControlPanelNavigation settings={settings} />
      <main>{children}</main>
    </ControlPanelProvider>
  );
}