import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  key = 'lukaSpace';

  constructor() { }

  public saveData(key: string, value: any) {
    let valueString = JSON.stringify(value);
    localStorage.setItem(key, this.encrypt(valueString));
  }

  public getData(key: string) {
    let data = localStorage.getItem(key)|| "";
    let valueString = this.decrypt(data);
    return JSON.parse(valueString);
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }
}