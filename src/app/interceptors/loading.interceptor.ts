import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service'; // Importa el servicio que maneja el estado de carga

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loadingService.setLoading(true); // Muestra el elemento de carga al comenzar la solicitud HTTP
    return next.handle(request).pipe(
      finalize(() => {
        this.loadingService.setLoading(false); // Oculta el elemento de carga al finalizar la solicitud HTTP
      })
    );
  }
}