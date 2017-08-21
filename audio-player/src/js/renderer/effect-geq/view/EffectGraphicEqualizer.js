import React from 'react'
import PropTypes from 'prop-types'
import { GraphicEqulizerParams } from '../../../common/Constants.js'
import OnOffSwitch from '../../common/controls/OnOffSwitch.js'
import SelectBox from '../../common/controls/SelectBox.js'

/**
 * [GrindRenderBeginPosition description]
 * @type {Number}
 */
const GridRenderBeginPosition = 20

/**
 * [GridRenderStepPpsition description]
 * @type {Number}
 */
const GridRenderStepPosition = 12

/**
 * Component for graphic equalizer window.
 */
export default class EffectGraphicEqualizer extends React.Component {
  /**
   * Initialize instance.
   *
   * @param {Object} props Properties。
   */
  constructor (props) {
    super(props)

    this._onChangeBind    = this._onChange.bind(this)
    this._gridLineCount   = (Math.abs(GraphicEqulizerParams.GainMin) / GraphicEqulizerParams.GainStep) +
                            (Math.abs(GraphicEqulizerParams.GainMax) / GraphicEqulizerParams.GainStep) + 1
    this._gridCenterIndex = Math.floor(this._gridLineCount / 2)
    this._onChangePresetNameBind = this._onChangePresetName.bind(this)
    this._onChangeConncectSwitchBind = this._onChangeConncectSwitch.bind(this)
  }

  /**
   * Occurs when the component is mount.
   */
  componentDidMount () {
    this.props.context.effectGraphicEqualizerStore.onChange(this._onChangeBind)
  }

  /**
   * Occurs when the component is unmount.
   */
  componentWillUnmount () {
    this.props.context.effectGraphicEqualizerStore.removeChangeListener(this._onChangeBind)
  }

  /**
   * Render for component.
   *
   * @return {ReactElement} Rendering data.
   */
  render () {
    return (
      <div className="effect-graphic-equalizer">
        <div className="effect-graphic-equalizer__header">
          <div className="effect-graphic-equalizer__header__presets">
            <SelectBox
              options={this.props.context.effectGraphicEqualizerStore.presetNames}
              selectedValue={this.props.context.effectGraphicEqualizerStore.presetNumber}
              onChange={this._onChangePresetNameBind} />
          </div>
          <div className="effect-graphic-equalizer__header__connect">
            <OnOffSwitch
              checked={this.props.context.effectGraphicEqualizerStore.connect}
              onChange={this._onChangeConncectSwitchBind} />
          </div>
        </div>
        <div className="effect-graphic-equalizer__gain">
          {this._renderStepText()}
          {this._renderGridLines()}
          {this._renderGains()}
        </div>
      </div>
    )
  }

  /**
   * Render for gain step text.
   *
   * @return {Array.<ReactElement>} Rendering data.
   */
  _renderStepText () {
    const elements  = []
    const className = 'effect-graphic-equalizer__gain__step-text'
    const offset    = 6

    elements.push((
      <div
        key={0}
        className={className}
        style={{top: GridRenderBeginPosition - offset}}>
        {'+' + GraphicEqulizerParams.GainMax + ' dB'}
      </div>
    ))

    elements.push((
      <div
        key={this._gridCenterIndex}
        className={className}
        style={{top: GridRenderBeginPosition + (this._gridCenterIndex * GridRenderStepPosition) - offset}}>
        {'+' + GraphicEqulizerParams.GainFlat + ' dB'}
      </div>
    ))

    elements.push((
      <div
        key={this._gridLineCount - 1}
        className={className}
        style={{top: GridRenderBeginPosition + ((this._gridLineCount - 1) * GridRenderStepPosition) - offset}}>
        {GraphicEqulizerParams.GainMin + ' dB'}
      </div>
    ))

    return elements
  }

  /**
   * Render for grid line.
   *
   * @param {Number} index Index of the grid lines.
   * @param {Number} position Rendering position.
   *
   * @return {ReactElement} Rendering data.
   */
  _renderGridLine (index, position) {
    const style     = {top: position}
    let   className = 'effect-graphic-equalizer__gain__step-line'
    className = (index === 0 || index === this._gridCenterIndex || index === this._gridLineCount - 1 ? className + ' highlight' : className)

    return (<div key={index} className={className} style={style} />)
  }

  /**
   * Render for grid lines.
   *
   * @return {Array.<ReactElement>} Rendering data.
   */
  _renderGridLines () {
    const elements = []
    for (let i = 0; i < this._gridLineCount; ++i) {
      elements.push(this._renderGridLine(i, GridRenderBeginPosition + (i * GridRenderStepPosition)))
    }

    return elements
  }

  /**
   * Render for gain sliders.
   *
   * @return {Array.<ReactElement>} Rendering data.
   */
  _renderGains () {
    return this.props.context.effectGraphicEqualizerStore.gains.map((gain, index) => {
      return (
        <div key={index}>
          <input
            className="effect-graphic-equalizer__gain__slider"
            style={{left: -44 + (index * 31)}}
            type="range"
            value={gain}
            min={GraphicEqulizerParams.GainMin}
            max={GraphicEqulizerParams.GainMax}
            step={GraphicEqulizerParams.GainStep}
            onChange={(ev) => {
              this.props.context.effectGraphicEqualizerAction.updateGain(index, ev.target.value)
            }} />
          <div
            className="effect-graphic-equalizer__gain__frequecy"
            style={{left: (index * 32) + 46}}>
            {this._frequecyToString(GraphicEqulizerParams.Bands[ index ])}
          </div>
        </div>
      )
    })
  }

  /**
   * Occurs when the connection switch is changed.
   *
   * @param {Boolean} connect If true to connect the effector, Otherwise disconnect.
   */
  _onChangeConncectSwitch (connect) {
    this.props.context.effectGraphicEqualizerAction.connect(connect)
  }

  /**
   * Occurs when the preset number is changed.
   *
   * @param {Number} presetNumber New preset number.
   */
  _onChangePresetName (presetNumber) {
    this.props.context.effectGraphicEqualizerAction.selectPreset(presetNumber)
  }

  /**
   * Occurs when the Store of the state has been changed.
   */
  _onChange () {
    this.forceUpdate()
  }

  /**
   * Convert a frequency to string.
   *
   * @param {Number} frequecy Frequecy.
   *
   * @return {String} Converted string.
   */
  _frequecyToString (frequecy) {
    if (1000 <= frequecy) {
      const value = frequecy / 1000
      return value + 'K'
    }

    return String(frequecy)
  }
}

EffectGraphicEqualizer.propTypes = {
  context: PropTypes.object
}
