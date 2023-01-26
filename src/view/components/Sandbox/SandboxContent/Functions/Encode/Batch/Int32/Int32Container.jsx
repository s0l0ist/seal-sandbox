import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'
import withConstants from 'view/hocs/withConstants'
import { compose } from 'redux'
import { Button, withStyles } from '@material-ui/core'
import styles from './styles'
import { injectIntl } from 'react-intl'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

class Int32Container extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      plainTextId: 'select',
      dataToEncode: ''
    }
  }

  onPlainTextChange = event => {
    const { value } = event.target
    this.setState({
      plainTextId: value
    })
  }

  onDataToEncodeBlur = event => {
    const value = event.target.value.replace(/,+/g, ',').replace(/,$/, '').replace(/^,*/, '')

    this.setState({
      dataToEncode: value || ''
    })
  }

  onDataToEncodeChange = event => {
    const { value } = event.target

    if (!/^[\d,-.]*$/.test(value)) {
      return
    }

    this.setState({
      dataToEncode: value || ''
    })
  }

  _constructAction = () => {
    const { morfixBatchEncodeInt32Request } = this.props

    const { plainTextId, dataToEncode } = this.state

    // Re-sanitize if user hit enter key
    const sanitizedDataToEncode = dataToEncode.replace(/,+/g, ',').replace(/,$/, '').replace(/^,*/, '') || ''

    return {
      action: morfixBatchEncodeInt32Request,
      payload: {
        id: plainTextId,
        array: sanitizedDataToEncode
      }
    }
  }

  componentDidMount() {
    const { onUpdateAction, payload } = this.props
    this.setState(
      {
        ...(payload.id && { plainTextId: payload.id }),
        ...(payload.array && { dataToEncode: payload.array })
      },
      () => {
        const action = this._constructAction()
        onUpdateAction(action)
      }
    )
  }

  componentDidUpdate(prevProps, prevState, _snapshot) {
    const { onUpdateAction, payload } = this.props

    // If the state has changed, update the action
    if (prevState !== this.state) {
      const action = this._constructAction()
      onUpdateAction(action)
    }

    // If the payload contents changed, set the new state.
    if (prevProps.payload.id !== payload.id || prevProps.payload.array !== payload.array) {
      this.setState({
        ...this.state,
        ...(payload.id && { plainTextId: payload.id }),
        ...(payload.array && { dataToEncode: payload.array })
      })
    }
  }

  onExec = event => {
    event.preventDefault()
    const { onExec } = this.props
    onExec()
  }

  render() {
    const {
      classes,
      intl,
      encParm,
      plainTexts,
      isBatchEncoderReady,
      constants: { SCHEME_TYPES }
    } = this.props

    const { plainTextId, dataToEncode } = this.state

    return (
      <Paper component="form" className={classes.root}>
        <Grid container direction="row" spacing={1} justifyContent="space-between" alignItems="center">
          <Grid
            item
            xs={12}
            sm={8}
            container
            direction="row"
            spacing={1}
            justifyContent="flex-start"
            alignItems="center"
          >
            <Grid item>
              <TextField
                select
                disabled={encParm.schemeType === 'select'}
                label={intl.formatMessage({ id: 'plaintext' })}
                helperText={intl.formatMessage({ id: 'select_plaintext_encode_description' })}
                className={classes.textField}
                value={plainTexts[plainTextId] ? plainTextId : 'select'}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu
                  }
                }}
                onChange={this.onPlainTextChange}
              >
                <MenuItem value={'select'} disabled>
                  {intl.formatMessage({ id: 'select_a_plaintext' })}
                </MenuItem>

                {Object.entries(plainTexts).map(([key, value], index) => (
                  <MenuItem key={index} value={key}>
                    {value.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                disabled={encParm.schemeType === 'select'}
                placeholder={intl.formatMessage({ id: 'data_to_encode' })}
                label={intl.formatMessage({ id: 'data_to_encode' })}
                helperText={intl.formatMessage({ id: 'data_to_encode_description' })}
                className={classes.input}
                value={dataToEncode}
                onBlur={this.onDataToEncodeBlur}
                onChange={this.onDataToEncodeChange}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4} container direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className={classes.button}
                onClick={this.onExec}
                disabled={
                  plainTextId === 'select' ||
                  encParm.schemeType === 'select' ||
                  encParm.schemeType === SCHEME_TYPES.none ||
                  ((encParm.schemeType === SCHEME_TYPES.bfv || encParm.schemeType === SCHEME_TYPES.bgv) &&
                    !isBatchEncoderReady)
                }
              >
                <Typography variant="button" display="block">
                  {intl.formatMessage({ id: 'encode_int32' })}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    )
  }
}

Int32Container.propTypes = {}

export default compose(withStyles(styles), withConstants, injectIntl)(Int32Container)
