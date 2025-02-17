import { EventHandler } from '@create-figma-plugin/utilities'

export interface FixPathHandler extends EventHandler {
  name: 'FIX_PATH'
  handler: (count: number) => void
}

export interface CloseHandler extends EventHandler {
  name: 'CLOSE'
  handler: () => void
}
