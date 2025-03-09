import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonService } from './common.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [CommonService],
  exports: [CommonService]
})
export class RootCommonModule { }

export class CommonModule {
  static forRootAsync(): DynamicModule {
    return {
      module: RootCommonModule,
    };
  }
}
