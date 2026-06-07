import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { HomeOutlined, InfoCircleOutlined } from '@ant-design/icons'

import ChatRoom from '@/pages/ChatRoom'

function App() {
  return (
    <BrowserRouter>
      <ChatRoom></ChatRoom>
    </BrowserRouter>
  )
}

export default App
