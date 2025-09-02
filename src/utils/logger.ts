import config from '@/src/config';

class Logger {

  private getConfig() {
    return config(); // 调用函数
  }


  private shouldLog(): boolean {
    return this.getConfig().ENABLE_LOGGING;
  }

  private shouldRemoteLog(): boolean {
    return this.getConfig().ENABLE_REMOTE_LOGGING;
  }

  info(message: string, ...args: any[]) {
    if (this.shouldLog()) {
      console.info(`[INFO] ${message}`, ...args);
    }
    this.sendToRemote('info', message, args);
  }

  warn(message: string, ...args: any[]) {
    if (this.shouldLog()) {
      console.warn(`[WARN] ${message}`, ...args);
    }
    this.sendToRemote('warn', message, args);
  }

  error(message: string, ...args: any[]) {
    if (this.shouldLog()) {
      console.error(`[ERROR] ${message}`, ...args);
    }
    this.sendToRemote('error', message, args);
  }

  debug(message: string, ...args: any[]) {
    if (this.shouldLog() && __DEV__) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  private sendToRemote(level: string, message: string, args: any[]) {
    if (!this.shouldRemoteLog()) return;

    // TODO: Implement remote logging service
    // This could integrate with services like Sentry, LogRocket, etc.
    const logData = {
      level,
      message,
      args,
      timestamp: new Date().toISOString(),
      environment: this.getConfig().ENVIRONMENT,
    };
    
    // Example: Send to remote service
    // remoteLoggingService.send(logData);
  }
}

export const logger = new Logger();