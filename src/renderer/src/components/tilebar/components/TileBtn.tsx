export function TitleBtn({
  title,
  onClick,
  hoverClass,
  children
}: {
  title: string
  onClick: () => void
  hoverClass: string
  children: React.ReactNode
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`flex h-9 w-11 items-center justify-center text-slate-500 transition-colors dark:text-white ${hoverClass}`}
    >
      {children}
    </button>
  )
}
