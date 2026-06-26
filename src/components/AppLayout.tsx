'use client';

import { ReactNode } from "react";
import SiteFooter from "./Site/SiteFooter/SiteFooter";
import SiteNavigation from "./UI/SiteNavigation/SiteNavigation";
import { usePathname } from "next/navigation";
import ControlPanelNavigation from "./ControlPanel/ControlPanelNavigation/ControlPanelNavigation";

export default function SiteLayout({ children }: { children?: ReactNode }) {

  const url = usePathname();

  const isControlPanel = url.startsWith('/control-panel');

  return (
    <>
      {isControlPanel ? <ControlPanelNavigation /> : <SiteNavigation />}
      <main>{children}</main>
      {!isControlPanel && <SiteFooter />}
    </>
  )
}