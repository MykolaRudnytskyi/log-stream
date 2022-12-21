import { registerEnumType } from '@nestjs/graphql'

// inspired by https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
export enum LogSeverity {
  /** @description The log entry has no assigned severity level. */
  DEFAULT = 'DEFAULT',
  /** @description Debug or trace information. */
  DEBUG = 'DEBUG',
  /** @description Routine information, such as ongoing status or performance. */
  INFO = 'INFO',
  /** @description Normal but significant events, such as start up, shut down, or a configuration change. */
  NOTICE = 'NOTICE',
  /** @description Warning events might cause problems. */
  WARNING = 'WARNING',
  /** @description Error events are likely to cause problems. */
  ERROR = 'ERROR',
  /** @description Critical events cause more severe problems or outages. */
  CRITICAL = 'CRITICAL',
  /** @description A person must take an action immediately. */
  ALERT = 'ALERT',
  /** @description One or more systems are unusable. */
  EMERGENCY = 'EMERGENCY',
}

registerEnumType(LogSeverity, {
  name: 'LogSeverity',
  valuesMap: {
    DEFAULT: { description: 'The log entry has no assigned severity level.' },
    DEBUG: { description: 'Debug or trace information.' },
    INFO: { description: 'Routine information, such as ongoing status or performance.' },
    NOTICE: { description: 'Normal but significant events, such as start up, shut down, or a configuration change.' },
    WARNING: { description: 'Warning events might cause problems.' },
    ERROR: { description: 'Error events are likely to cause problems.' },
    CRITICAL: { description: 'Critical events cause more severe problems or outages.' },
    ALERT: { description: 'A person must take an action immediately.' },
    EMERGENCY: { description: 'One or more systems are unusable.' },
  },
})
