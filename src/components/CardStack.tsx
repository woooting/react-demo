import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useState, type ChangeEvent } from 'react'

interface TodoItem {
  id: string
  isActive: boolean
  value: string
}
type filterType = 'all' | 'active' | 'completed'


function CardStack() {
  const [itemList, setItemList] = useState<TodoItem[]>([])
  // TODO: 添加 filter state ('all' | 'active' | 'completed')
  const [filter, setFilter] = useState<filterType>('all')
  return (
    <div>
      <div className="card-stack bg-white p-2 w-124 flex items-center justify-center">
        <InputArea setItemList={setItemList}></InputArea>
      </div>
      {itemList.length > 0 && (
        <List itemList={itemList} setItemList={setItemList} filter={filter}></List>
      )}
      {itemList.length > 0 && (
        <div className="flex gap-2 justify-center">
          {/* TODO: 点击切换 filter，当前选中的按钮高亮 */}
          <button
            className="mr-auto"
            onClick={() =>
              setItemList((prev) => prev.map((item) => ({ ...item, isActive: !item.isActive })))
            }
          >
            Select ALL
          </button>
          <button
            className={filter === 'all' ? 'text-blue-600' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'active' ? 'text-blue-600' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={filter === 'completed' ? 'text-blue-600' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button className="ml-auto" onClick={() => setItemList([])}>
            ClearALL
          </button>
        </div>
      )}
    </div>
  )
}

function InputArea({
  setItemList,
}: {
  setItemList: React.Dispatch<React.SetStateAction<TodoItem[]>>
}) {
  const [inputValue, setInputValue] = useState('')
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }
  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() != '') {
      setItemList((prev) => [
        ...prev,
        { id: crypto.randomUUID(), isActive: false, value: inputValue.trim() },
      ])
      setInputValue('')
    }
  }

  return (
    <Input
      autoFocus
      className="h-16 border-none focus-visible:ring-0 placeholder:text-2xl text-2xl placeholder:opacity-50"
      placeholder="请输入文字"
      value={inputValue}
      onChange={handleChange}
      onKeyDown={handleKeydown}
    ></Input>
  )
}

function List({
  itemList,
  setItemList,
  filter,
}: {
  itemList: TodoItem[]
  setItemList: React.Dispatch<React.SetStateAction<TodoItem[]>>
  filter: filterType
}) {
  function Item({ item, onToggle }: { item: TodoItem; onToggle: () => void }) {
    return (
      <li className="group flex items-center h-16 gap-3 border px-5 ">
        <Checkbox checked={item.isActive} onCheckedChange={onToggle} />
        {/* TODO: isActive 时加 line-through 和灰色文字 */}
        <span className={'text-2xl' + (item.isActive ? ' line-through text-gray-400' : '')}>
          {item.value}
        </span>
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity text-3xl ml-auto"
          data-action="delete"
          data-id={item.id}
        >
          x
        </button>
      </li>
    )
  }

  const filte1List = itemList.filter((item) => {
    if (filter === 'all') return true
    if (filter === 'active') return !item.isActive
    if (filter === 'completed') return item.isActive
  })

  function handleDelete(e: React.MouseEvent<HTMLUListElement>) {
    const target = e.target as HTMLElement
    if (target.dataset.action === 'delete') {
      const id = target.dataset.id
      setItemList((prev) => prev.filter((item) => item.id !== id))
    }
  }

  return (
    <ul onClick={handleDelete}>
      {filte1List.map((item) => (
        <Item
          key={item.id}
          item={item}
          onToggle={() => {
            setItemList((prev) =>
              prev.map((todo) =>
                todo.id === item.id ? { ...item, isActive: !item.isActive } : todo,
              ),
            )
          }}
        ></Item>
      ))}
    </ul>
  )
}

export default CardStack
