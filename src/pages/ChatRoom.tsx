import { useState, useEffect, useRef } from 'react'
import { socket } from '@/api/chat'
import GlobalInput from '@/components/GlobalInput'
interface onlineList {
  username: string
  id: string
}
interface AskResponse {
  ok: boolean
  msg: string
}
interface MsgList {
  type: 'text' | 'image'
  content: string
  username: string
  time: string
}
interface InputItem {
  type: 'text' | 'image'
  value: string
}

function CharRoom() {
  const [isJoined, setJonined] = useState(false)
  const [onlineList, setOnlineList] = useState<onlineList[]>([])
  const [msgList, setMsgList] = useState<MsgList[]>([])
  const [username, setUserName] = useState('')
  const toggleJonine = () => setJonined(true)
  const saveUserName = (data: string) => setUserName(data)
  useEffect(() => {
    const onConnect = () => {
      console.log('已连接, id:', socket.id)
    }
    const onMsg = (data: MsgList) => {
      console.log('收到消息:', data)
      setMsgList((prev) => [...prev, data])
    }
    const onUpdate = (data: onlineList[]) => {
      setOnlineList(() => [...data])
      console.log('i get it', data)
    }

    socket.on('connect', onConnect)
    socket.on('chat-msg', onMsg)
    socket.on('online-user', onUpdate)
    return () => {
      socket.off('connect', onConnect)
      socket.off('chat-msg', onMsg)
      socket.off('online-user', onUpdate)
    }
  }, [])

  return (
    <div className="h-screen">
      {!isJoined ? (
        <GlobalInput toggleState={toggleJonine} saveUserName={saveUserName} />
      ) : (
        <main className="flex h-screen">
          <SideBar List={onlineList} />
          <section className="flex flex-1 flex-col bg-[rgb(255,248,245)]">
            <ChatWindow msgList={msgList} username={username} />
            <InputArea />
          </section>
        </main>
      )}
    </div>
  )
}

function SideBar({ List }: { List: onlineList[] }) {
  return (
    <aside className="w-[240px] h-full flex flex-col bg-[#fdf6f0] border-r border-amber-200/60 shrink-0">
      <div className="px-5 py-5 border-b border-amber-200/40">
        <h2 className="text-sm font-semibold tracking-wide text-amber-900/70 uppercase">
          在线用户
        </h2>
        <p className="mt-1 text-xs text-amber-700/50">{List.length} 人在线</p>
      </div>
      <ul className="flex-1 overflow-y-auto py-2">
        {List.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 mx-3 px-4 py-3 rounded-xl cursor-default transition-colors duration-200 hover:bg-amber-100/60"
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-1 ring-emerald-600/20" />
            </span>
            <span className="text-sm text-amber-900/80 font-medium truncate">{item.username}</span>
          </li>
        ))}
      </ul>
      {List.length === 0 && (
        <p className="px-5 py-8 text-center text-xs text-amber-700/40">暂无在线用户</p>
      )}
    </aside>
  )
}

function ChatWindow({ msgList, username }: { msgList: MsgList[]; username: string }) {
  const msgEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const isNearBottomRef = useRef(true)
  const handleClick = () => msgEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handleScroll = () => {
      isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 50
      setShowScrollBtn(!isNearBottomRef.current)
    }
    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isNearBottomRef.current) {
      console.log(isNearBottomRef.current)
      msgEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [msgList])
  return (
    <div className="flex-1 min-h-0 bg-[rgb(255,248,245)] relative">
      <div
        ref={containerRef}
        className="flex flex-col gap-5 p-4 h-full overflow-y-auto bg-[rgb(255, 248, 245)] border-b-gray-300 border-b-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/50 [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(156,163,175,0.5)_transparent]"
      >
        {msgList.map((item) => (
          <MsgItem key={item.time} item={item} isSelf={item.username === username} />
        ))}
        <div ref={msgEndRef} />
      </div>
      {showScrollBtn && (
        <button
          onClick={handleClick}
          className="absolute bottom-22 right-8 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md ring-1 ring-gray-200 backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg hover:scale-105 active:scale-95"
        >
          <svg
            className="h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}
    </div>
  )
}
function MsgItem({ item, isSelf }: { item: MsgList; isSelf: boolean }) {
  return (
    <div className={`flex gap-2 w-full max-w-full ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
      <svg
        viewBox="0 0 40 40"
        className="h-8 w-8 shrink-0 rounded-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="20" cy="20" r="20" fill="#D1D5DB" />
        <circle cx="20" cy="16" r="7" fill="#9CA3AF" />
        <ellipse cx="20" cy="35" rx="14" ry="10" fill="#9CA3AF" />
      </svg>
      <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} max-w-[70%]`}>
        <div className="text-[#9f9f9b] px-1">{item.username}</div>
        {item.type === 'image' ? (
          <img src={item.content} className="max-w-60 max-h-60 rounded-2xl" />
        ) : (
          <span
            className={`inline-block whitespace-pre-wrap wrap-break-word px-4 py-2 ${isSelf ? 'bg-green-500' : 'bg-gray-400'} text-white rounded-2xl`}
          >
            {item.content}
          </span>
        )}
      </div>
    </div>
  )
}

function InputArea() {
  const inputRef = useRef<HTMLDivElement>(null)

  const insertNodeAtCursor = (node: Node) => {
    const sel = window.getSelection()
    if (!sel || !sel.rangeCount) return
    const range = sel.getRangeAt(0)
    range.deleteContents()
    range.insertNode(node)
    range.setStartAfter(node)
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
  }

  const insertImageAtCursor = (src: string) => {
    const img = document.createElement('img')
    img.src = src
    img.className = 'inline-block max-h-20 rounded align-middle'
    insertNodeAtCursor(img)
  }

  const extractItems = (): InputItem[] => {
    const items: InputItem[] = []
    const children = inputRef.current!.childNodes
    let textBuffer = ''
    console.log('文本结点结构', children)
    for (const child of children) {
      if (child.nodeType === Node.TEXT_NODE) {
        textBuffer += child.textContent
      } else if (child instanceof HTMLImageElement) {
        if (textBuffer.trim()) items.push({ type: 'text', value: textBuffer.trim() })
        textBuffer = ''
        items.push({ type: 'image', value: child.src })
      } else if (child instanceof HTMLBRElement) {
        textBuffer += '\n'
      }
    }

    if (textBuffer.trim()) items.push({ type: 'text', value: textBuffer.trim() })

    return items
  }

  const sendMessage = () => {
    const items = extractItems()
    if (items.length === 0) return
    let i = 0
    const sendNext = () => {
      if (i >= items.length) {
        inputRef.current!.innerHTML = ''
        return
      }
      const item = items[i++]
      socket.emit('send-msg', { content: item.value, type: item.type }, (res: AskResponse) => {
        res.ok ? sendNext() : alert(res.msg)
      })
    }
    sendNext()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const items = e.clipboardData.items
    let hasImage = false
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        hasImage = true
        const file = item.getAsFile()
        if (!file) continue
        const reader = new FileReader()
        reader.onload = () => insertImageAtCursor(reader.result as string)
        reader.readAsDataURL(file)
      }
    }
    if (!hasImage) {
      const text = e.clipboardData.getData('text/plain')
      if (text) insertNodeAtCursor(document.createTextNode(text))
    }
  }

  return (
    <div className="flex flex-col h-40 px-4 py-3 border-2 border-gray-500/45 rounded-3xl mx-4.5 my-6 shrink-0 bg-[rgb(255,248,245)]">
      <div
        ref={inputRef}
        contentEditable
        className="flex-1 w-full overflow-y-auto outline-none border-none focus:caret-green-700 whitespace-pre-wrap break-words [&_img]:inline-block [&_img]:max-h-20 [&_img]:rounded [&_img]:align-middle"
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />
      <div className="h-[15%] shrink-0" />
    </div>
  )
}
export default CharRoom
