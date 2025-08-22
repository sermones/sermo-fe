import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '../../components/Navbar'

export const Route = createFileRoute('/home/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center p-4 iphone16-container">
      <div className="relative w-full max-w-sm z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">홈</h2>
            <p className="text-gray-600 text-sm">홈 페이지입니다</p>
          </div>
          
        </div>
        <div className="mb-10">

        </div>
        <Navbar />
      </div>
    </div>
  )
}
