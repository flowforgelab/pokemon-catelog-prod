import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class SyncService {
  constructor(@InjectQueue('sync') private syncQueue: Queue) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async scheduleDailySync() {
    await this.syncQueue.add('sync-cards', {}, {
      removeOnComplete: true,
      removeOnFail: false,
    })
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async schedulePriceSync() {
    await this.syncQueue.add('sync-prices', {}, {
      removeOnComplete: true,
      removeOnFail: false,
    })
  }

  @Cron(CronExpression.EVERY_WEEK)
  async scheduleFullSync() {
    await this.syncQueue.add('full-sync', {}, {
      removeOnComplete: true,
      removeOnFail: false,
    })
  }

  async triggerManualSync(type: 'cards' | 'prices' | 'full') {
    await this.syncQueue.add(`sync-${type}`, {}, {
      removeOnComplete: true,
      removeOnFail: false,
    })
  }
}