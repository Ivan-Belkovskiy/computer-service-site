'use client';

import { ReactNode } from "react";
import SiteFooter from "./Site/SiteFooter/SiteFooter";
import SiteNavigation from "./UI/SiteNavigation/SiteNavigation";
import { usePathname } from "next/navigation";
import ControlPanelNavigation from "./ControlPanel/ControlPanelNavigation/ControlPanelNavigation";

export default function AppLayout({ children, siteSettings }: { children?: ReactNode, siteSettings?: Record<string, string> }) {

  const url = usePathname();

  const isControlPanel = url.startsWith('/control-panel');

  return (
    <>
      {isControlPanel ? <ControlPanelNavigation /> : <SiteNavigation settings={siteSettings} />}
      <main>{children}</main>
      {!isControlPanel && <SiteFooter settings={siteSettings} />}
    </>
  )
}