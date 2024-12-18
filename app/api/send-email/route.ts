import { sendMail } from '@/lib/server/services/EmailService';
import catchAsync from '@/lib/server/utils/catchAsync';
import { NextRequest, NextResponse } from 'next/server';


export const POST = catchAsync(async (req: NextRequest) => {
    const { toEmail, templateId, contact } = await req.json();
    await sendMail(toEmail, templateId, contact);
    return NextResponse.json({
        message: 'Email sent successfully',
    }, { status: 200 });
});

