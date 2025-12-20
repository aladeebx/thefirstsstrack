import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET user company info (public, no auth required)
// Used by widget to display company name
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        companyName: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Return company information
    return NextResponse.json({
      companyName: user.companyName,
    });
  } catch (error) {
    console.error('Get user company error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company information' },
      { status: 500 }
    );
  }
}

