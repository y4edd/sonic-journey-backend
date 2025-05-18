import { ConsoleLogger } from '@nestjs/common';

export class MyLogger extends ConsoleLogger {
  // オーバーライド（上書き）して自分の形式にする

  log(message: string) {
    super.log(`[MyApp] ${message}`); // 親クラスの log を使う
  }

  error(message: string, trace?: string) {
    super.error(`[MyApp ERROR] ${message}`, trace);
  }

  warn(message: string) {
    super.warn(`[MyApp WARN] ${message}`);
  }

  debug(message: string) {
    super.debug(`[MyApp DEBUG] ${message}`);
  }

  verbose(message: string) {
    super.verbose(`[MyApp VERBOSE] ${message}`);
  }
}
