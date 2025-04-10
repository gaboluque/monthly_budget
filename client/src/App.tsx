import { useRoutes } from 'react-router'
import { routes } from './routes/_index'
import { UIRoot } from './lib/ui'

function App() {
  const appRoutes = useRoutes(Object.values(routes));

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {appRoutes}
      <UIRoot />
    </div>
  )
}

export default App
