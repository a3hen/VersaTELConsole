import React from 'react'
import { Status } from 'components/Base'
import styles from './index.scss'

export default class VStatus extends React.Component {
  getStatusType() {
    const { name = '' } = this.props
    if (
      name === 'ONLINE' ||
      name === 'OK' ||
      name === 'Healthy' ||
      name === 'UpToDate' ||
      name === 'Diskless' ||
      name === 'InUse' ||
      name === 'SUCCESSFUL'
    ) {
      return 'Running'
    }

    if (name === 'Warning' || name.indexOf('Connecting') !== -1) {
      return 'Warning'
    }

    if (name === 'Synching' || name.indexOf('SyncTarget') !== -1) {
      return 'Updating'
    }

    // if (name === 'OFFLINE' || name === 'ERROR'){
    //   return 'Stopped'
    // }
    return 'Stopped'
  }

  getStatusName() {
    const { name = '' } = this.props
    if (name === 'OK' || name === 'SUCCESSFUL') {
      return 'NORMAL'
    }
    return name || 'ERROR'
    // return 'ERROR'
  }

  render() {
    return (
      <div className={styles.status}>
        <Status
          type={this.getStatusType(this.props.name)}
          name={t(this.getStatusName(this.props.name))}
        />
      </div>
    )
  }
}
