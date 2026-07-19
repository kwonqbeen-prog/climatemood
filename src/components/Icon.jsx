export default function Icon({ name, filled = false, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-rounded${filled ? ' icon-fill' : ''} ${className}`}
    >
      {name}
    </span>
  )
}
