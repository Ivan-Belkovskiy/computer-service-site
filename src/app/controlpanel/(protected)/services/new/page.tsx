import ServiceManagementForm from "@/components/ControlPanel/ServiceManagementForm/ServiceManagementForm";
import "../services.css";
import { createService } from "../actions";

export default function NewServicePage() {
    return (
        <div className="new-service-page">
            <ServiceManagementForm actionFn={createService} />
        </div>
    );
}