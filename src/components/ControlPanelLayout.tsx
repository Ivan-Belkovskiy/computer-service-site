'use client';

import { ReactNode } from "react";
import SiteFooter from "./Site/SiteFooter/SiteFooter";
import SiteNavigation from "./UI/SiteNavigation/SiteNavigation";
import ControlPanelNavigation from "./ControlPanel/ControlPanelNavigation/ControlPanelNavigation";

export default function ControlPanelLayout({ children }: { children?: ReactNode }) {

  return (
    <>
      <ControlPanelNavigation />
      <main>{children}</main>
    </>
  )
}