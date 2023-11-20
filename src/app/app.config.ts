import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ConfigurationService } from './core/services/api/configuration.service';
import { MatDialogModule } from '@angular/material/dialog';

export function configLoader(
  configService: ConfigurationService
): () => Promise<any> {
  return () => configService.load('/assets/config.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: configLoader,
      multi: true,
      deps: [ConfigurationService],
    },
    importProvidersFrom([MatDialogModule])
   ]
};




// CORE - providers to services (inRoot) httpClient
// SHARED - reusable ui (components, directives, pipes)
// FEATURES - lazy loaded - adminFeature, AuthFeature, ReportsFeature

// RouterModule - <router-outlet>, Router, ActivatedRoute