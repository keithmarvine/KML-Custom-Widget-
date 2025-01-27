/** @jsx jsx */
import { React, jsx } from 'jimu-core'
import { type AllWidgetSettingProps } from 'jimu-for-builder'

export default function Setting (props: AllWidgetSettingProps<any>) {
  const handleWidgetLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const label = event.target.value
    props.onSettingChange({
      id: props.id,
      config: props.config.set('widgetLabel', label)
    })
  }

  return (
    <div className="widget-setting">
      <label>
        Widget Label:
        <input
          type="text"
          value={props.config.widgetLabel || ''}
          onChange={handleWidgetLabelChange}
        />
      </label>
    </div>
  )
}
