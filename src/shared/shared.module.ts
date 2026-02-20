import { NgModule } from '@angular/core';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoadingInterceptor } from '../shared/services/loading/loading.interceptor';
import { LoadingComponent } from './services/loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [LoadingComponent],
  imports: [HttpClientModule, MatProgressSpinnerModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }],
})
export class SharedModule {}
