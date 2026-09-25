import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { event, path, duration } = await req.json();

    const userAgent = req.headers.get('user-agent') || '';
    const isBot = /bot|google|yandex|baidu|bing|msn|duckduckgo|crawler|spider/i.test(userAgent);
    
    if (isBot) {
      return NextResponse.json({ ok: true, skipped: 'bot' });
    }

    await prisma.tracking_events.create({
      data: {
        event,
        path: path || '/',
        duration: typeof duration === 'number' ? duration : null,
        userAgent,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}