export async function GET(req: Request, { params } : any) {

    console.log('${params}.id')

    return new Response()
}

export async function POST(req: Request) {
    const body = await req.json();

    return new Response()
}