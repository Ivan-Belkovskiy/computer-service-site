'use client';

import { ReactNode, useEffect } from "react";
import SiteFooter from "./Site/SiteFooter/SiteFooter";
import SiteNavigation from "./UI/SiteNavigation/SiteNavigation";

export default function AppLayout({ children, siteSettings }: { children?: ReactNode, siteSettings?: Record<string, string> }) {

  // useEffect(() => {
    
  //   const keyDownHandler = (e: KeyboardEvent) => {
  //     if (e.key === 'F12') {
  //       // alert('Вход в инструменты разработчика запрещен!!!')
  //       e.preventDefault();
  //       return false;
  //       }
  //   }

  //   const contextMenuHandler = (e: Event) => {
  //     // alert('Контекстное меню запрещено!');
  //     e.preventDefault();
  //     return false;
  //   }

  //   if (typeof window !== 'undefined') {
  //     window.addEventListener('contextmenu', contextMenuHandler);
  //     window.addEventListener('keydown', keyDownHandler);
  //     }

  //   return () => {
  //     if (typeof window !== 'undefined') {
  //     window.removeEventListener('contextmenu', contextMenuHandler);
  //     window.removeEventListener('keydown', keyDownHandler);
  //     }
  //   }
  // }, []);

  return (
    <>
      <SiteNavigation settings={siteSettings} />
      <main>{children}</main>
      <SiteFooter settings={siteSettings} />
    </>
  )
}