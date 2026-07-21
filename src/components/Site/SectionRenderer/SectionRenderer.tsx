import HeroSection from "@/components/Site/HeroSection/HeroSection";
import ServicesSection from "@/components/Site/ServicesSection/ServicesSection";
import FeaturesSection from "@/components/Site/FeaturesSection/FeaturesSection";
import ContactsSection from "@/components/Site/ContactsSection/ContactsSection";

interface SectionData {
  id: number;
  type: string;
  props: any;
}

interface SectionRendererProps {
  sections: SectionData[];
  settings: Record<string, any>;
}

export default function SectionRenderer({ sections, settings }: SectionRendererProps) {
  if (!sections || sections.length === 0) {
    return (
      <div className="main-page">
        <p style={{ padding: 40, textAlign: 'center' }}>
          Данная страница находится на этапе заполнения контентом! Она будет доступна в ближайшее время!
          {/* Страница находится в режиме наполнения секций. */}
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

          default:
            return (
              <div key={section.id} style={{ padding: 20, background: '#eee', textAlign: 'center' }}>
                Компонент для секции {section.type} еще не создан.
              </div>
            );
        }
      })}
    </>
  );
}