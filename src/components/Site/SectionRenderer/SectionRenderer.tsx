import HeroSection from "@/components/Site/HeroSection/HeroSection";
import ServicesSection from "@/components/Site/ServicesSection/ServicesSection";
import FeaturesSection from "@/components/Site/FeaturesSection/FeaturesSection";
import ContactsSection from "@/components/Site/ContactsSection/ContactsSection";
import CustomSectionRenderer from "@/components/Site/CustomSectionRenderer/CustomSectionRenderer";
import { CustomSection, PageSection } from "@/app/controlpanel/(protected)/editor/page";

interface SectionData {
  id: number;
  type: string;
  props: any;
  content?: any;
}

interface SectionRendererProps {
  sections: PageSection[];
  customSections: CustomSection[];
  settings: Record<string, any>;
  isEditMode?: boolean;
  selectedBlockId?: string | null;
  onSelectBlock?: (blockId: string) => void;
}

export default function SectionRenderer({
  sections,
  customSections,
  settings,
  isEditMode = false,
  selectedBlockId,
  onSelectBlock
}: SectionRendererProps) {
  if (!sections || sections.length === 0) {
    return (
      <div className="main-page">
        <p style={{ padding: 40, textAlign: 'center' }}>
          Данная страница находится на этапе заполнения контентом!
        </p>
      </div>
    );
  }

  return (
    <>
      {sections.map((section) => {
        const props = (section.props as Record<string, any>) || {};

        switch (section.type) {
          case "HERO":
            return <HeroSection key={section.id} initialSettings={settings} {...props} />;

          case "SERVICES":
            return (
              <ServicesSection
                key={section.id}
                title={props.title || "Наши услуги"}
                showCategories={props.showCategories ?? true}
                limit={props.limit ? Number(props.limit) : undefined}
                globalPadding={props.globalPadding ? Number(props.globalPadding) : undefined}
              />
            );

          case "FEATURES":
            return <FeaturesSection key={section.id} {...props} />;

          case "CONTACTS":
            return <ContactsSection key={section.id} initialSettings={settings} {...props} />;

          case "CUSTOM":
          default:

            const data = customSections.find(cs => cs.id === section.custom_section_id);

            if (data) return (
              <CustomSectionRenderer
                key={data.id}
                content={data.content as any}
                isEditMode={isEditMode}
                selectedBlockId={selectedBlockId}
                onSelectBlock={onSelectBlock}
              />
            );
        }
      })}
    </>
  );
}