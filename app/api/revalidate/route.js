import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('secret');

    if (token !== process.env.REVALIDATION_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        revalidatePath('/');

        console.log('revalidation running----');

        return NextResponse.json({ revalidated: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error revalidating' }, { status: 500 });
    }
}
