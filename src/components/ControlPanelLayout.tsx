'use client';

import { ReactNode } from "react";
import SiteFooter from "./Site/SiteFooter/SiteFooter";
import SiteNavigation from "./UI/SiteNavigation/SiteNavigation";
import ControlPanelNavigation from "./ControlPanel/ControlPanelNavigation/ControlPanelNavigation";
import { getSiteSettings } from "@/app/actions";

export default function ControlPanelLayout({ children, settings }: { children?: ReactNode; settings: Record<string, string> }) {

  return (
    <>
      <ControlPanelNavigation settings={settings} />
      <main>{children}</main>
    </>
  )
}