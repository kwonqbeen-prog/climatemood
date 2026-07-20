import Icon from './Icon'
import { useTheme } from '../contexts/ThemeContext'

/**
 * 아이콘 전용 버튼. 고대비 모드에서는 "아이콘 단독 사용 금지" 원칙에 따라
 * 텍스트 라벨을 함께 노출한다.
 */
export default function IconButton({
  icon,
  label,
  filled = false,
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  iconClassName = '',
}) {
  const { resolvedTheme } = useTheme()
  const showLabel = resolvedTheme === 'high-contrast'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`inline-flex items-center gap-1.5 ${className}`}
    >
      <Icon name={icon} filled={filled} className={iconClassName} />
      {showLabel && <span className="text-sm font-bold">{label}</span>}
    </button>
  )
}
