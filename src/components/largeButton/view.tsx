import { IconType, IconBaseProps } from 'react-icons'

import './styles.scss'

type Props = {
  label: string
  icon: IconType
  description: string
  iconProps?: IconBaseProps
  isDisabled?: boolean
  onClick: () => void
}

export const LargeButton = ({
  label,
  icon: Icon,
  description,
  iconProps,
  isDisabled,
  onClick,
}: Props) => (
  <button className="large-button" disabled={isDisabled} onClick={onClick}>
    <Icon {...(iconProps || {})} />
    <div>
      <span className="label">{label}</span>
      <span className="desc">{description}</span>
    </div>
  </button>
)
