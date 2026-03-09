import { NgModule } from '@angular/core';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoadingInterceptor } from '../shared/services/loading/loading.interceptor';
import { LoadingComponent } from './services/loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatButton } from '@angular/material/button';

@NgModule({ declarations: [LoadingComponent, ConfirmDialogComponent], imports: [MatProgressSpinnerModule, MatButton], providers: [{ provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }, provideHttpClient(withInterceptorsFromDi())] })
export class SharedModule {}
