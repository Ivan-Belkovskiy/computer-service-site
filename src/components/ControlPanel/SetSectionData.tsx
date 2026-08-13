'use client';

import { useEffect } from 'react';
import { useControlPanel } from '@/context/ControlPanelContext';

export default function SetSectionData({ data }: { data: any }) {
    const { setSectionData } = useControlPanel();

    useEffect(() => {
        setSectionData(data);

        return () => {
            setSectionData(null);
        };
    }, [data, setSectionData]);

    return null;
}