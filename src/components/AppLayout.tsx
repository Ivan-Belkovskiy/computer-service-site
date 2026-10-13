'use client';

import { ReactNode, useEffect } from "react";
import SiteFooter from "./Site/SiteFooter/SiteFooter";
import SiteNavigation from "./UI/SiteNavigation/SiteNavigation";
import TimeOnPageTracker from "./Analytics/TimeOnPageTracker";

export type LegalDocumentLink = {
  id: number;
  slug: string;
  title: string;
  url: string;
  url_type: "PAGE" | "EXTERNAL";
  show_in_footer: boolean;
  show_in_modal: boolean; 
};

export default function AppLayout({
  children,
  siteSettings,
  pageLinks,
  legalDocuments = [],
}: {
  children?: ReactNode;
  siteSettings?: Record<string, string>;
  pageLinks: { id: number; name: string; slug: string }[];
  legalDocuments?: LegalDocumentLink[];
}) {
  return (
    <>
      <SiteNavigation settings={siteSettings} pageLinks={pageLinks} />
      <main>{children}</main>
      <SiteFooter
        settings={siteSettings}
        pageLinks={pageLinks}
        legalDocuments={legalDocuments}
      />
    </>
  );
}