import { NextResponse } from 'next/server';
import { initDb } from '@/lib/initDb';

export async function GET() {
  try {
    initDb(); // Initialize the DB
    return NextResponse.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Database initialization failed:', error);
    return NextResponse.json(
      { error: 'Failed to initialize the database' },
      { status: 500 }
    );
  }
}
