import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private encryptionKey = environment.encryptionKey;

  public saveData(key: string, value: any) {
    const valueString = JSON.stringify(value);
    localStorage.setItem(key, this.encrypt(valueString));
  }

  public getData(key: string) {
    const data = localStorage.getItem(key) || '';
    const valueString = this.decrypt(data);
    return data == '' ? null : JSON.parse(valueString);
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.encryptionKey).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.encryptionKey).toString(CryptoJS.enc.Utf8);
  }
}
