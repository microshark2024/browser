'use client'

import { useState, useRef } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, ChevronDown, Compass, ExternalLink, Globe2, Home, LockKeyhole, MoreHorizontal, Plus, RotateCw, Search, X } from 'lucide-react'
import { NewTabPage } from '@/components/new-tab-page'

type BrowserTab = {
  id: number
  history: string[]
  position: number
  reload: number
}

const initialTab: BrowserTab = { id: 1, history: [''], position: 0, reload: 0 }
const shortcuts = [
  { label: '维基百科', url: 'https://zh.wikipedia.org', initial: 'W' },
  { label: 'GitHub', url: 'https://github.com', initial: 'G' },
  { label: 'MDN 文档', url: 'https://developer.mozilla.org/zh-CN/', initial: 'M' },
  { label: '哔哩哔哩', url: 'https://www.bilibili.com', initial: 'B' },
]

function resolveAddress(value: string) {
  const input = value.trim()
  if (!input) return ''
  if (/^https?:\/\//i.test(input)) {
    try {
      const url = new URL(input)
      return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : ''
    } catch { return '' }
  }
  if (/^(localhost|\d{1,3}(?:\.\d{1,3}){3})(:\d+)?(\/|$)/i.test(input)) return `http://${input}`
  if (/^[^\s./]+(?:\.[^\s./]+)+(?:[:/]\S*)?$/i.test(input)) {
    try { return new URL(`https://${input}`).href } catch { return '' }
  }
  return `https://www.google.com/search?q=${encodeURIComponent(input)}`
}

function displayTitle(url: string) {
  if (!url) return '新标签页'
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '网页' }
}

export function BrowserShell() {
  const [tabs, setTabs] = useState<BrowserTab[]>([initialTab])
  const [activeId, setActiveId] = useState(1)
  const [draft, setDraft] = useState('')
  const [bookmarks, setBookmarks] = useState(shortcuts)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const nextId = useRef(2)
  const addressRef = useRef<HTMLInputElement>(null)
  const activeTab = tabs.find(tab => tab.id === activeId) ?? tabs[0]
  const url = activeTab.history[activeTab.position]
  const bookmarked = bookmarks.some(item => item.url === url)

  function navigate(value: string) {
    const destination = resolveAddress(value)
    if (!destination) return
    setTabs(current => current.map(tab => tab.id === activeId
      ? { ...tab, history: [...tab.history.slice(0, tab.position + 1), destination], position: tab.position + 1 }
      : tab))
    setDraft(destination)
    setSidebarOpen(false)
    addressRef.current?.blur()
  }

  function switchTab(tab: BrowserTab) {
    setActiveId(tab.id)
    setDraft(tab.history[tab.position])
  }

  function addTab() {
    const id = nextId.current++
    setTabs(current => [...current, { id, history: [''], position: 0, reload: 0 }])
    setActiveId(id)
    setDraft('')
    setSidebarOpen(false)
  }

  function closeTab(id: number) {
    if (tabs.length === 1) {
      setTabs([{ id, history: [''], position: 0, reload: 0 }])
      setDraft('')
      return
    }
    const index = tabs.findIndex(tab => tab.id === id)
    const remaining = tabs.filter(tab => tab.id !== id)
    setTabs(remaining)
    if (activeId === id) {
      const next = remaining[Math.min(index, remaining.length - 1)]
      setActiveId(next.id)
      setDraft(next.history[next.position])
    }
  }

  function travel(delta: number) {
    const position = activeTab.position + delta
    if (position < 0 || position >= activeTab.history.length) return
    setTabs(current => current.map(tab => tab.id === activeId ? { ...tab, position } : tab))
    setDraft(activeTab.history[position])
  }

  function refresh() {
    setTabs(current => current.map(tab => tab.id === activeId ? { ...tab, reload: tab.reload + 1 } : tab))
  }

  function goHome() {
    if (url) setTabs(current => current.map(tab => tab.id === activeId ? { ...tab, history: [...tab.history.slice(0, tab.position + 1), ''], position: tab.position + 1 } : tab))
    setDraft('')
    setSidebarOpen(false)
  }

  function toggleBookmark() {
    if (!url) return
    if (bookmarked) setBookmarks(current => current.filter(item => item.url !== url))
    else setBookmarks(current => [...current, { label: displayTitle(url), url, initial: displayTitle(url)[0].toUpperCase() }])
  }

  return (
    <main className="flex h-dvh min-h-[540px] overflow-hidden bg-background font-sans text-foreground">
      {sidebarOpen && <button className="fixed inset-0 z-20 bg-foreground/20 lg:hidden" aria-label="关闭侧栏" onClick={() => setSidebarOpen(false)} />}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 flex w-60 shrink-0 flex-col border-r border-border bg-sidebar px-4 pb-5 pt-6 transition-transform lg:static lg:translate-x-0`}>
        <div className="flex items-center gap-3 px-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Compass className="size-5" strokeWidth={2} /></div>
          <div className="flex flex-col"><span className="text-[15px] font-semibold tracking-tight">远航浏览器</span><span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">VOYAGE BROWSER</span></div>
        </div>
        <div className="mt-11 flex flex-col gap-1">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground">工作空间</p>
          <button onClick={addTab} className="flex h-10 items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"><Plus className="size-[18px] text-muted-foreground" />新建标签页</button>
          <button onClick={goHome} className="flex h-10 items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition-colors hover:bg-accent" aria-label="返回首页"><Home className="size-[18px] text-muted-foreground" />首页</button>
        </div>
        <div className="mt-9 flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between px-3 pb-3"><p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground">我的收藏</p><Bookmark className="size-3.5 text-muted-foreground" /></div>
          <div className="flex flex-col gap-1 overflow-auto">
            {bookmarks.map(item => <button key={item.url} onClick={() => navigate(item.url)} className="flex h-10 items-center gap-3 rounded-lg px-3 text-left text-sm text-sidebar-foreground transition-colors hover:bg-accent"><span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary text-[11px] font-bold text-secondary-foreground">{item.initial}</span><span className="truncate">{item.label}</span></button>)}
          </div>
        </div>
        <div className="border-t border-border pt-4"><div className="flex items-center gap-3 rounded-xl bg-secondary px-3 py-3"><div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"><Globe2 className="size-4" /></div><div className="min-w-0"><p className="text-xs font-semibold">自由探索网络</p><p className="mt-0.5 text-[11px] text-muted-foreground">从任何网址开始旅程</p></div></div></div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 flex-col bg-background">
          <div className="flex h-12 items-end gap-1 border-b border-border bg-secondary/60 px-3 pt-2 md:px-5">
            <button className="mb-2 mr-1 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent lg:hidden" aria-label="打开侧栏" onClick={() => setSidebarOpen(true)}><MoreHorizontal className="size-5" /></button>
            <div className="flex min-w-0 flex-1 items-end gap-1 overflow-x-auto [scrollbar-width:none]">
              {tabs.map(tab => {
                const selected = tab.id === activeId
                return <div key={tab.id} className={`group flex h-9 min-w-28 max-w-52 flex-1 items-center gap-2 rounded-t-xl border-x border-t px-3 transition-colors sm:min-w-40 ${selected ? 'border-border bg-background text-foreground' : 'border-transparent bg-transparent text-muted-foreground hover:bg-accent'}`}>
                  <button onClick={() => switchTab(tab)} className="flex min-w-0 flex-1 items-center gap-2 text-left text-xs font-medium"><Globe2 className="size-3.5 shrink-0" /><span className="truncate">{displayTitle(tab.history[tab.position])}</span></button>
                  <button onClick={() => closeTab(tab.id)} aria-label={`关闭 ${displayTitle(tab.history[tab.position])} 标签页`} className="flex size-5 shrink-0 items-center justify-center rounded hover:bg-muted"><X className="size-3.5" /></button>
                </div>
              })}
            </div>
            <button onClick={addTab} aria-label="新建标签页" className="mb-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"><Plus className="size-4" /></button>
            <div className="mb-2 ml-2 hidden items-center gap-1.5 text-[11px] font-medium text-muted-foreground md:flex"><span className="size-1.5 rounded-full bg-primary" />在线</div>
          </div>
          <div className="flex h-16 items-center gap-1.5 border-b border-border px-3 md:gap-3 md:px-6">
            <div className="flex items-center gap-0.5">
              <button onClick={() => travel(-1)} disabled={activeTab.position === 0} aria-label="后退" className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"><ArrowLeft className="size-[18px]" /></button>
              <button onClick={() => travel(1)} disabled={activeTab.position >= activeTab.history.length - 1} aria-label="前进" className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"><ArrowRight className="size-[18px]" /></button>
              <button onClick={refresh} aria-label="刷新页面" className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"><RotateCw className="size-[17px]" /></button>
            </div>
            <form onSubmit={event => { event.preventDefault(); navigate(draft) }} className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-secondary/65 px-3 transition-colors focus-within:border-ring focus-within:bg-background md:px-4">
              {url.startsWith('https://') ? <LockKeyhole className="size-4 shrink-0 text-muted-foreground" /> : url ? <Globe2 className="size-4 shrink-0 text-muted-foreground" /> : <Search className="size-4 shrink-0 text-muted-foreground" />}
              <label htmlFor="browser-address" className="sr-only">输入网址或搜索内容</label>
              <input ref={addressRef} id="browser-address" value={draft} onChange={event => setDraft(event.target.value)} onFocus={event => event.target.select()} placeholder="搜索或输入网址" autoComplete="off" spellCheck={false} className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
              <span className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">↵</span>
            </form>
            <button onClick={toggleBookmark} disabled={!url} aria-label={bookmarked ? '取消收藏' : '收藏当前网页'} title={bookmarked ? '取消收藏' : '收藏当前网页'} className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"><Bookmark className={`size-[18px] ${bookmarked ? 'fill-current text-primary' : ''}`} /></button>
            <button onClick={() => url && window.open(url, '_blank', 'noopener,noreferrer')} disabled={!url} aria-label="在新窗口打开" title="在新窗口打开" className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30"><ExternalLink className="size-[18px]" /></button>
          </div>
        </header>
        <section className="relative min-h-0 flex-1 overflow-auto bg-background" aria-label="网页内容">
          {url ? <div className="flex h-full min-h-0 flex-col">
            <div className="flex min-h-11 shrink-0 items-center justify-between gap-3 border-b border-border bg-secondary/40 px-4 py-2 text-xs text-muted-foreground md:px-6"><span className="truncate">正在浏览 <strong className="font-medium text-foreground">{displayTitle(url)}</strong> · 部分网站不允许在页面内显示</span><a href={url} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center gap-1 font-medium text-primary hover:underline">在新窗口打开<ArrowUpRight className="size-3.5" /></a></div>
            <iframe key={`${activeTab.id}-${activeTab.position}-${activeTab.reload}`} src={url} title={`${displayTitle(url)} 网页`} className="h-full w-full flex-1 border-0 bg-background" referrerPolicy="no-referrer" />
          </div> : <NewTabPage onNavigate={navigate} />}
        </section>
        <footer className="flex h-8 shrink-0 items-center justify-between border-t border-border bg-background px-4 text-[11px] text-muted-foreground md:px-6"><span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-primary" />准备就绪</span><span className="flex items-center gap-1">远航浏览器 <ChevronDown className="size-3" /></span></footer>
      </div>
    </main>
  )
}

export { shortcuts }
