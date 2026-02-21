import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogData {
  message: string;
  leftText: string;
  rightText: string;
}

export enum ConfirmDialogResult {
  Left = 'left',
  Right = 'right',
  Close = 'close',
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onLeft(): void {
    this.dialogRef.close(ConfirmDialogResult.Left);
  }

  onRight(): void {
    this.dialogRef.close(ConfirmDialogResult.Right);
  }

  onClose(): void {
    this.dialogRef.close(ConfirmDialogResult.Close);
  }
}
