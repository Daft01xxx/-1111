import { NextRequest, NextResponse } from 'next/server'

export function GET(request: NextRequest) {
  const origin = request.nextUrl.origin

  return NextResponse.json({
    url: origin,
    name: 'Napiwas game',
    iconUrl: `${origin}/images/napiwas-logo.jpg`,
    termsOfUseUrl: origin,
    privacyPolicyUrl: origin,
  })
}
