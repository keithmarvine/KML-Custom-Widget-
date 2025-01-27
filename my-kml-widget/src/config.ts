import { type ImmutableObject } from 'seamless-immutable'

export interface Config {
  widgetLabel: string
}

export type IMConfig = ImmutableObject<Config>
