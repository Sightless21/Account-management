"use client"
import { BoxChart1, BoxChart2, BoxChart3 } from '@/components/box-chart';
import React from 'react';
import { Suspense } from 'react';

export default function Page() {
    function RenderData() {
        const [data, setData] = React.useState<string | null>(null);

        React.useEffect(() => {
            const fetchData = async () => {
                await new Promise((resolve) =>
                    setTimeout(() => resolve(setData('Data Loaded: John Doe')), 800)
                );
            };
            fetchData();
        }, []);

        if (!data) {
            return (
                <div className='flex justify-center items-center'>
                    <span className="loading loading-dots loading-lg" />
                </div>
            )
        }

        return (
            <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
                <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
                    <BoxChart1 />
                    <BoxChart2 />
                    <BoxChart3 />
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1>Meeting Room Dashboar</h1>
            <Suspense>
                {/* ส่วนนี้จะถูกแสดงหลังจากโหลดเสร็จ */}
                <RenderData />
            </Suspense>
        </div>
    );
}