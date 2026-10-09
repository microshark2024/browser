'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight, Compass, Search, Sparkles } from 'lucide-react'

const destinations = [
  { label: '维基百科', subtitle: '探索知识的边界', initial: 'W', url: 'https://zh.wikipedia.org' },
  { label: 'GitHub', subtitle: '发现开源灵感', initial: 'G', url: 'https://github.com' },
  { label: 'MDN 文档', subtitle: '学习 Web 技术', initial: 'M', url: 'https://developer.mozilla.org/zh-CN/' },
  { label: '哔哩哔哩', subtitle: '看看有趣的世界', initial: 'B', url: 'https://www.bilibili.com' },
]

export function NewTabPage({ onNavigate }: { onNavigate: (value: string) => void }) {
  const [query, setQuery] = useState('')
  return <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pb-12 pt-10 md:px-10 md:pt-14 lg:px-14">
    <div className="mb-7 flex items-center justify-between gap-4"><div className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><Compass className="size-4 text-primary" />新的旅程</div><div className="hidden text-xs text-muted-foreground sm:block">每一次探索，都有新的发现。</div></div>
    <div className="relative isolate flex min-h-72 flex-col justify-end overflow-hidden rounded-2xl bg-primary p-7 text-primary-foreground md:min-h-[340px] md:p-10 lg:min-h-[380px]">
      <Image src="/browser-landscape.png" alt="晨光照耀山峦与湖泊的风景" fill priority sizes="(max-width: 768px) 100vw, 1100px" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
      <div className="max-w-xl"><span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary/20 px-3 py-1 text-[11px] font-medium backdrop-blur-sm"><Sparkles className="size-3" />开启你的探索</span><h1 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl md:leading-tight">世界很大，<br />从这里出发。</h1><p className="mt-3 text-sm leading-relaxed text-primary-foreground/80 md:text-base">输入一个网址，或搜索你感兴趣的一切。</p></div>
    </div>
    <form onSubmit={event => { event.preventDefault(); onNavigate(query) }} className="relative z-10 mx-auto -mt-6 flex h-14 w-[calc(100%-2rem)] max-w-2xl items-center gap-3 rounded-xl border border-border bg-card px-4 shadow-xl shadow-foreground/10 md:h-16 md:px-5"><Search className="size-5 shrink-0 text-muted-foreground" /><label htmlFor="home-search" className="sr-only">搜索或输入网址</label><input id="home-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索任何事物，或输入网址..." autoComplete="off" className="min-w-0 flex-1 bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground md:text-base" /><button type="submit" aria-label="开始浏览" className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-85"><ArrowRight className="size-4" /></button></form>
    <div className="mt-14 flex items-center justify-between"><div><h2 className="text-lg font-semibold tracking-tight text-foreground">常用目的地</h2><p className="mt-1 text-sm text-muted-foreground">从熟悉的地方，发现新的可能</p></div><span className="hidden text-xs text-muted-foreground sm:block">快速访问 <ArrowUpRight className="ml-1 inline size-3" /></span></div>
    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">{destinations.map(item => <button key={item.url} onClick={() => onNavigate(item.url)} className="group flex min-h-32 flex-col items-start justify-between rounded-xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md md:min-h-36 md:p-5"><span className="flex size-9 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-primary">{item.initial}</span><span className="flex w-full items-end justify-between gap-2"><span className="min-w-0"><span className="block truncate text-sm font-semibold text-card-foreground">{item.label}</span><span className="mt-1 block truncate text-xs text-muted-foreground">{item.subtitle}</span></span><ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" /></span></button>)}</div>
    <div className="mt-9 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-relaxed text-muted-foreground"><span className="font-medium text-foreground">浏览提示</span><span>部分网站禁止嵌入显示；遇到空白页面时，请点击右上角的“在新窗口打开”。</span></div>
  </div>
}
