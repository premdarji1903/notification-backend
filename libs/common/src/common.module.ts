import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [],
  exports: []
})
export class RootCommonModule { }

export class CommonModule {
  static forRootAsync(): DynamicModule {
    return {
      module: RootCommonModule,
    };
  }
}
