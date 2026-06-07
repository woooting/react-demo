import { Input } from '@/components/ui/input'
import { useRef } from 'react'
import { socket } from '@/api/chat'
interface AskResponse {
  ok: boolean
  msg: string
  username?: string
}

function GlobalInput({
  toggleState,
  saveUserName,
}: {
  toggleState: () => void
  saveUserName: (data: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const askCallBack = (res: AskResponse) => {
    if (res.ok) {
      console.log('success')
      toggleState()
      saveUserName(res.username!)
    } else {
      alert(res.msg)
    }
  }

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = inputRef.current?.value
      if (value?.trim()) {
        socket.emit('user-login', { username: value }, askCallBack)
      }
    }
  }

  return (
    <div className=" h-full flex flex-col pt-45 gap-5 items-center">
      <p>欢迎来到chatroom，请输入你的昵称并回车，开始聊天 -v-</p>
      <div className="border-6 rounded-md">
        <Input
          ref={inputRef}
          autoFocus
          className="h-7 w-46 border-none focus-visible:ring-0"
          onKeyDown={handleKeydown}
        ></Input>
      </div>
    </div>
  )
}
export default GlobalInput
