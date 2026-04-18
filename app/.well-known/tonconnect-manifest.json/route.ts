import { NextRequest, NextResponse } from 'next/server'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'public, max-age=300, s-maxage=300',
  }
}

export function GET(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = forwardedHost ?? request.nextUrl.host
  const protoHeader = request.headers.get('x-forwarded-proto')
  const protocol = protoHeader ?? (host.includes('localhost') ? 'http' : 'https')
  const origin = `${protocol}://${host}`

  return NextResponse.json(
    {
      url: origin,
      name: 'Napiwas game',
      iconUrl: `${origin}/images/napiwas-logo.jpg`,
      termsOfUseUrl: `${origin}/`,
      privacyPolicyUrl: `${origin}/`,
    },
    { headers: corsHeaders() }
  )
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  })
}
