
// export async function generateMetadata(): Promise<Metadata> {
//   const meta = await loadMetadata();
//   return {
//     title: `Панель Управления | ${meta?.data?.title || "Computer-Service-Site"}`,
//     description: meta?.data?.description || "Ремонт компьютеров и ноутбуков",
//   };
// }

import MainInfoEditor from "@/components/ControlPanel/MainInfoEditor/MainInfoEditor";
import { Metadata } from "next";
import { loadMetadata } from "../../actions";
import { prisma } from "@/lib/prisma";


import "./page.css";

export default async function ControlPanelPage() {

    const analyticsData = await prisma.tracking_events.groupBy({
        by: "event",
        _count: {
            _all: true
        }
    });

    const counts = analyticsData.reduce((acc, curr) => {
        acc[curr.event] = curr._count._all;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="control-panel">
            <h1 className="control-panel__title">Статистика по сайту</h1>

            <div className="control-panel__controls">
                <button className="control-panel__button">Основная информация</button>
                <button className="control-panel__button"></button>
                <button className="control-panel__button"></button>
            </div>
            <div className="control-panel__content main-statistics-info">
                <div className="control-panel__block block-num-01">
                    <span className="control-panel__value">{counts['page_open'] || 0} раз</span>
                    <span className="control-panel__label">Открыли страниц</span>
                </div>
                <div className="control-panel__symbol">⇓</div>
                <div className="control-panel__block block-num-02">
                    <span className="control-panel__value">{counts['order_modal_open'] || 0} раз</span>
                    <span className="control-panel__label">Открыли модальное окно "Оставить заявку"</span>
                </div>
                <div className="control-panel__symbol">⇓</div>
                <div className="control-panel__block block-num-03">
                    <span className="control-panel__value">{counts['order_modal_submit'] || 0} раз</span>
                    <span className="control-panel__label">Оставили заявку</span>
                </div>
            </div>

            {/* <pre>{JSON.stringify(analyticsData, null, 4)}</pre> */}
            {/* <MainInfoEditor /> */}
            {/* <ControlPanel /> */}
        </div>
    )
}