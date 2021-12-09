import React from 'react'
import { Status } from 'components/Base'
import styles from './index.scss'

export default class VStatus extends React.Component {
  getStatusType() {
    if (
      this.props.name === 'ONLINE' ||
      this.props.name === 'OK' ||
      this.props.name === 'Healthy' ||
      this.props.name === 'UpToDate' ||
      this.props.name === 'Diskless'
    ) {
      return 'Running'
    }

    if (this.props.name === 'Warning' || this.props.name === 'Synching') {
      return 'Update'
    }

    // if (this.props.name === 'OFFLINE' || this.props.name === 'ERROR'){
    //   return 'Stopped'
    // }
    return 'Stopped'
  }

  render() {
    return (
      <div className={styles.status}>
        <Status
          type={this.getStatusType(this.props.name)}
          name={this.props.name}
        />
      </div>
    )
  }
}
