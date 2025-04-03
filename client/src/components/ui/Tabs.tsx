import { createContext, useContext } from "react"

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function Tabs({ value, onValueChange, children }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <div className={`flex gap-2 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value: triggerValue, children, className = "" }: TabsTriggerProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error("TabsTrigger must be used within a Tabs component")
  const { value, onValueChange } = context

  return (
    <button
      onClick={() => onValueChange(triggerValue)}
      className={`px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border-b-2 -mb-px transition-colors ${
        triggerValue === value ? "border-blue-500 text-blue-700" : "border-transparent"
      } ${className}`}
    >
      {children}
    </button>
  )
} 