import "./FeaturesSection.css";

interface Feature {
    id: number;
    title: string;
    description?: string;
    // icon: string;
}

const FEATURES_DATA: Feature[] = [
    {
        id: 1,
        title: "Бесплатный выезд и диагностика",
        description: "Вы не платите за диагностику и выезд мастера в случае последующего ремонта техники.",
    },
    {
        id: 2,
        title: "Гарантия от 3-х месяцев",
        description: "Предоставляем официальную гарантию на все выполненные работы и замененные детали.",
    },
    {
        id: 3,
        title: "Без скрытых платежей",
        description: "Стоимость ремонта согласовывается с вами до начала работ и не меняется в процессе.",
    },
    {
        id: 4,
        title: "Скидка 5% при заказе с сайта",
        description: "Оставьте заявку через форму на сайте и получите гарантированную скидку на любые услуги.",
    }
];

export default function FeaturesSection() {
    return (
        <section className="features-section">
            <h2 className="features-section__title">Преимущества нашего сервиса</h2>
            <div className="features-section__content">
                {FEATURES_DATA.map((feature) => (
                    <div key={feature.id} className="feature-block">
                        <div className="feature-block__number">{feature.id}</div>
                        <div className="feature-block__data">
                            <h3 className="feature-block__title">{feature.title}</h3>
                            {feature.description && (
                                <p className="feature-block__description">{feature.description}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}