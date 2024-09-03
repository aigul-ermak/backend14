import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { appSettings } from './app.setting';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../infrastructure/exception-filters/http.exception.filters';
import {AppModule} from "../app.module";
import {useContainer} from "class-validator";

// Префикс нашего приложения (http://site.com/api)
const APP_PREFIX = '/api';



// Используем данную функцию в main.ts и в e2e тестах
export const applyAppSettings = (app: INestApplication) => {
  // Применение глобальных Interceptors
  // app.useGlobalInterceptors()
  // Применение глобальных Guards
  //  app.useGlobalGuards(new AuthGuard());
  // Применить middleware глобально
  //app.use(LoggerMiddlewareFunc);
  // Установка префикса
  //setAppPrefix(app);
  // Конфигурация swagger документации
  //setSwagger(app);
  // Применение глобальных pipes
  //setAppPipes(app);
  // Применение глобальных exceptions filters
  //setAppExceptionsFilters(app);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
};

// const setAppPrefix = (app: INestApplication) => {
//   app.setGlobalPrefix(APP_PREFIX);
// };

// const setSwagger = (app: INestApplication) => {
//   if (!appSettings.env.isProduction()) {
//     const swaggerPath = APP_PREFIX + '/swagger-doc';
//
//     const config = new DocumentBuilder()
//       .setTitle('BLOGGER API')
//       .addBearerAuth()
//       .setVersion('1.0')
//       .build();
//
//     const document = SwaggerModule.createDocument(app, config);
//     SwaggerModule.setup(swaggerPath, app, document, {
//       customSiteTitle: 'Blogger Swagger',
//     });
//   }
// };

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
      new ValidationPipe()
    // new ValidationPipe({
    //   transform: true,
    //   stopAtFirstError: true,

      // exceptionFactory: (errors) => {
      //   const customErrors = [];
      //
      //   errors.forEach((e) => {
      //     const constraintKeys = Object.keys(e.constraints);
      //
      //     constraintKeys.forEach((cKey) => {
      //       const msg = e.constraints[cKey];
      //
      //       customErrors.push({ key: e.property, message: msg });
      //     });
      //   });
      //
      //   // Error 400
      //   throw new BadRequestException(customErrors);
      // },
    // }
    // ),
  );
};

// const setAppExceptionsFilters = (app: INestApplication) => {
//   app.useGlobalFilters(new HttpExceptionFilter());
// };
