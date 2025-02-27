import Link from "next/link"

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        {/* ... existing code ... */}
        
        <div className="flex items-center space-x-4">
          <Link 
            href="/mes-habitudes"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Mes Habitudes
          </Link>
          {/* ... autres liens existants ... */}
        </div>
        
        {/* ... existing code ... */}
      </div>
    </nav>
  )
}