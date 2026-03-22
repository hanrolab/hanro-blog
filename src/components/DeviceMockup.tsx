interface DeviceMockupProps {
  readonly type: 'web' | 'mobile' | 'book'
  readonly title: string
  readonly accent?: string
  readonly images?: {
    readonly desktop?: string
    readonly tablet?: string
    readonly mobile?: string
  }
}

function LaptopMockup({ title, accent = '#e5e5e5', image }: { title: string; accent?: string; image?: string }) {
  return (
    <div className="relative w-[360px] lg:w-[480px]">
      <div className="rounded-t-xl border border-[#d1d1d1] bg-[#1a1a1a] p-1">
        <div className="flex items-center gap-1.5 rounded-t-lg bg-[#2a2a2a] px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
          <div className="ml-3 flex-1 rounded bg-[#3a3a3a] px-2 py-0.5">
            <span className="text-[7px] text-[#888]">b3d.co.kr</span>
          </div>
        </div>
        <div className="aspect-[16/10] rounded-b-lg bg-white overflow-hidden">
          {image ? (
            <img src={image} alt={title} className="h-full w-full object-cover object-left-top [image-rendering:auto] will-change-transform" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="space-y-2 p-4">
                <div className="h-2 w-16 rounded bg-[#eee]" />
                <div className="h-1.5 w-24 rounded bg-[#f0f0f0]" />
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="aspect-square rounded" style={{ backgroundColor: accent + '30' }} />
                  <div className="aspect-square rounded" style={{ backgroundColor: accent + '20' }} />
                  <div className="aspect-square rounded" style={{ backgroundColor: accent + '15' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mx-auto h-2 w-[105%] rounded-b-lg bg-gradient-to-b from-[#c8c8c8] to-[#d8d8d8]" />
      <div className="mx-auto h-1 w-[40%] rounded-b bg-[#b8b8b8]" />
      <p className="mt-4 text-center text-[12px] font-medium text-text-muted">{title}</p>
    </div>
  )
}

function PhoneMockup({ title, accent = '#e5e5e5', image }: { title: string; accent?: string; image?: string }) {
  return (
    <div className="relative w-[120px] lg:w-[140px]">
      <div className="rounded-[20px] border-2 border-[#2a2a2a] bg-[#1a1a1a] p-1">
        <div className="mx-auto mb-1 h-1.5 w-12 rounded-full bg-[#2a2a2a]" />
        <div className="aspect-[9/19] rounded-[14px] bg-white overflow-hidden">
          {image ? (
            <img src={image} alt={title} className="h-full w-full object-cover object-top [image-rendering:auto] will-change-transform" />
          ) : (
            <div className="flex h-full items-center justify-center p-3">
              <div className="space-y-2 w-full">
                <div className="h-1.5 w-8 rounded bg-[#eee]" />
                <div className="h-1 w-12 rounded bg-[#f0f0f0]" />
                <div className="mt-3 aspect-[4/3] rounded-lg" style={{ backgroundColor: accent + '20' }} />
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="mt-3 text-center text-[12px] font-medium text-text-muted">{title}</p>
    </div>
  )
}

function TabletMockup({ accent = '#e5e5e5', image, label = '' }: { accent?: string; image?: string; label?: string }) {
  return (
    <div className="relative hidden w-[180px] lg:block">
      <div className="rounded-[14px] border-2 border-[#2a2a2a] bg-[#1a1a1a] p-1">
        <div className="aspect-[3/4] rounded-[10px] bg-white overflow-hidden">
          {image ? (
            <img src={image} alt="Tablet" className="h-full w-full object-cover object-left-top [image-rendering:auto] will-change-transform" />
          ) : (
            <div className="flex h-full items-center justify-center p-3">
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between">
                  <div className="h-1.5 w-10 rounded bg-[#eee]" />
                  <div className="h-1.5 w-5 rounded bg-[#f0f0f0]" />
                </div>
                <div className="aspect-[16/9] rounded-lg" style={{ backgroundColor: accent + '20' }} />
              </div>
            </div>
          )}
        </div>
      </div>
      {label && <p className="mt-3 text-center text-[12px] font-medium text-text-muted">{label}</p>}
    </div>
  )
}

function BookMockup({ title }: { title: string }) {
  return (
    <div className="relative w-[140px] lg:w-[160px]">
      <div className="relative aspect-[2/3] rounded-r-md rounded-l-sm bg-gradient-to-br from-[#2a2a2a] to-[#111] shadow-xl">
        <div className="absolute left-0 top-0 bottom-0 w-3 rounded-l-sm bg-gradient-to-r from-[#1a1a1a] to-[#333]" />
        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
          <div className="h-px w-8 bg-white/20" />
          <p className="mt-3 text-[9px] font-bold leading-tight tracking-[0.15em] text-white/80 uppercase">
            {title}
          </p>
          <div className="mt-3 h-px w-8 bg-white/20" />
        </div>
        <div className="absolute top-1 right-0 bottom-1 w-1 rounded-r-sm bg-[#f5f0e8]" />
      </div>
      <p className="mt-3 text-center text-[12px] font-medium text-text-muted">BOOK</p>
    </div>
  )
}

export function DeviceMockup({ type, title, accent, images }: DeviceMockupProps) {
  if (type === 'web') {
    return (
      <div className="flex items-end justify-center py-6">
        <LaptopMockup title="" accent={accent} image={images?.desktop} />
      </div>
    )
  }

  if (type === 'mobile') {
    return (
      <div className="flex items-end justify-center gap-6 lg:gap-8 py-6">
        <PhoneMockup title="iOS" accent={accent} image={images?.mobile} />
        <TabletMockup accent={accent} image={images?.tablet} label="태블릿" />
        <PhoneMockup title="Android" accent={accent} image={images?.mobile} />
      </div>
    )
  }

  return (
    <div className="flex items-end justify-center gap-4 py-6">
      <BookMockup title={title} />
    </div>
  )
}
