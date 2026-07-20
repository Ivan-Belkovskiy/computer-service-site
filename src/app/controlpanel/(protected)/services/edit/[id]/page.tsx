import ServiceManagementForm from "@/components/ControlPanel/ServiceManagementForm/ServiceManagementForm";
import "./page.css";
import { createService, editService } from "../../actions";
import { prisma } from "@/lib/prisma";

export default async function EditServicePage({
    params
}: {
    params: Promise<{ id: string }>
}) {

    const resolved = await params;
    const serviceId = parseInt(resolved.id, 10);

    const service = await prisma.services.findUnique({
        where: {
            id: serviceId,
        }
    });

    if (!service) return <p>Услуга не найдена!</p>

    return (
        <div className="edit-service-page">
            <ServiceManagementForm uiAction="edit" actionFn={editService} editingService={service} />
        </div>
    );
}