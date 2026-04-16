import { NextResponse } from 'next/server';

export function jsonNoStore(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': 'private, no-store, must-revalidate',
      Pragma: 'no-cache',
    },
  });
}
