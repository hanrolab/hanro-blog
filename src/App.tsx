import { Routes, Route } from 'react-router-dom'
import { Blog } from '@/pages/Blog'
import { Home } from '@/pages/Home'
import { ProjectDetail } from '@/pages/ProjectDetail'
import { HeroPreview } from '@/pages/HeroPreview'

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/portfolio" element={<Home />} />
        <Route path="/portfolio/projects/:id" element={
          <div className="flex-1">
            <ProjectDetail />
          </div>
        } />
        <Route path="/hero-preview" element={
          <div className="flex-1">
            <HeroPreview />
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
