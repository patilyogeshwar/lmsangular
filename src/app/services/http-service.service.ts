import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  apiURL = 'http://143.244.136.201:3001/v1/';

  constructor(private http: HttpClient) { }

  post(url: string, data: any) {
    return this.http.post<any>(this.apiURL + url, data);
  }

  patch(url: string, data: any) {
    const id = data.id;
    delete data.id;
    return this.http.patch<any>(this.apiURL + url + "/" + id, data);
  }

  get(url: string) {
    return this.http.get<any>(this.apiURL + url);
  }

  getById(url: string, id: string) {
    return this.http.get<any>(this.apiURL + url + "/" + id);
  }

  delete(url: string, id: any) {
    return this.http.delete<any>(this.apiURL + url + "/" + id);
  }
}
