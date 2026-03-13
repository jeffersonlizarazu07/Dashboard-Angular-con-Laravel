import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    fetch('http://127.0.0.1:7788/ingest/9dd0ed2f-e734-4b9b-aea3-7e346eaf6a22', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '8d12e3' },
      body: JSON.stringify({
        sessionId: '8d12e3',
        runId: 'pre-fix',
        hypothesisId: 'H1',
        location: 'src/main.ts:bootstrap',
        message: 'Angular bootstrapped; environment loaded',
        data: { production: environment.production, apiUrl: environment.apiUrl, sanctumUrl: environment.sanctumUrl },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  })
  .catch((err) => console.error(err));
