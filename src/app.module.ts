import { Module } from '@nestjs/common';
import { AppController, UserController } from './controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationModule } from './application/application.module';
import { AwsSdkModule } from 'nest-aws-sdk';
import { SES } from 'aws-sdk';
import { ConfigModule } from '@nestjs/config';

const controllers = [AppController, UserController];
const providers = [];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.SQLITE_DB ?? './db/project_database.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AwsSdkModule.forRoot({
      defaultServiceOptions: {
        region: process.env.AWS_DEFAULT_REGION ?? 'sa-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? 'any-access-key-id',
          secretAccessKey:
            process.env.AWS_SECRET_ACCESS_KEY ?? 'any-secret-key',
        },
      },
      services: [SES],
    }),
    ApplicationModule,
  ],
  controllers,
  providers,
})
export class AppModule {}
