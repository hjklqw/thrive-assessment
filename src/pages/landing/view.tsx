import { useRecoilState } from 'recoil'

import { RiLoginCircleFill as LoginIcon } from 'react-icons/ri'
import { FaSave as SaveIcon } from 'react-icons/fa'
import { IoMdRefreshCircle as ReloadIcon } from 'react-icons/io'
import { PiUserSquareDuotone as BackgroundIcon } from 'react-icons/pi'

import './styles.scss'

import { LargeButton } from '../../components/largeButton'
import { Table } from '../../components/table'
import { Toast } from '../../components/toast'
import { columnOrderAtom } from '../../state/columnOrders'
import { isLoggedInAtom } from '../../state/session'

import { columns, users } from './data'
import { save, reload } from './utils'

export const LandingPage = () => {
  const [isLoggedIn, setLoggedIn] = useRecoilState(isLoggedInAtom)
  const [columnOrders, setColumnOrders] = useRecoilState(columnOrderAtom)

  return (
    <div className="landing-page">
      <BackgroundIcon className="background-icon" />

      <section className="storage-controls">
        <LargeButton
          label="Login"
          icon={LoginIcon}
          description="To access the Save and Reload buttons"
          onClick={() => setLoggedIn(true)}
          isDisabled={isLoggedIn}
        />
        <LargeButton
          label="Save"
          icon={SaveIcon}
          description="Save the current column orders"
          onClick={() => save(columnOrders)}
          isDisabled={!isLoggedIn}
        />
        <LargeButton
          label="Reload"
          icon={ReloadIcon}
          description="Restore the column orders to default"
          iconProps={{ size: 26 }}
          onClick={() => reload(!!columnOrders, setColumnOrders)}
          isDisabled={!isLoggedIn}
        />
      </section>

      <Table data={users} columns={columns} />

      <Toast />
    </div>
  )
}
