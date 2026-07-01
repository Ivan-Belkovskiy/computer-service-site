'use client';

import Image from 'next/image';
import './HeroSection.css';
import NewOrderModal from '@/components/UI/NewOrderModal/NewOrderModal';
import { useState } from 'react';

export default function HeroSection() {

    const [isModalOpened, setModalOpened] = useState<boolean>(false);

    return (
        <section className='hero-section'>
            <Image
                src="/main-section.jpg"
                alt="Ремонт ноутбуков и ПК"
                fill
                priority
                className="object-cover object-center z-[-1]"
            />

            <div className="hero-section__overlay"></div>
            {/* <div className="absolute inset-0 bg-black/60 z-0"></div> */}

            <div className="hero-section__content">
                <h1 className='hero-section__title'>Профессиональное обслуживание и ремонт компьютеров в Минске</h1>
                <p className="hero-section__description">Бесплатная диагностика при последующем ремонте. Гарантия от 3 месяцев</p>
                <div className="hero-section__buttons">
                    <button className="hero-section__button primary-btn" onClick={() => setModalOpened(true)}>Оставить заявку</button>
                    <a className="hero-section__button secondary-btn" href='tel:+375291234567'>Позвонить!</a>
                </div>
            </div>

            <NewOrderModal isOpened={isModalOpened} onClose={() => setModalOpened(false)} onSubmit={() => setModalOpened(false)} />

        </section>
    )
}