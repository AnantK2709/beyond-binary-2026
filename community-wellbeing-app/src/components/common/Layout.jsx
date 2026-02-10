import Navbar from '../components/components/common/Navbar'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-ocean-50">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default Layout
