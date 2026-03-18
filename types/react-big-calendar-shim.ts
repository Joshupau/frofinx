declare module 'react-big-calendar' {
  import * as React from 'react'

  export type View = 'month' | 'week' | 'work_week' | 'day' | 'agenda'

  export type EventProps<TEvent = any> = {
    event: TEvent
    title?: string
  }

  export type SlotInfo = {
    start: Date
    end: Date
    slots: Date[]
    action: 'select' | 'click' | 'doubleClick'
  }

  export const Calendar: React.ComponentType<any>
  export const dateFnsLocalizer: (args: any) => any
}
