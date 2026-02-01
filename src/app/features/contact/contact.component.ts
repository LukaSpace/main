import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate(250, style({ transform: 'translateY(0)' }))
      ]),
    ]),
  ],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButton]
})
export class ContactComponent {
  private readonly myEmail: string = 'lukaspace.contact@gmail.com';
    @ViewChild('contactFormDirective') contactFormDirective: FormGroupDirective;

    contactForm: FormGroup;

    constructor(private fb: FormBuilder) {
      this.contactForm = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        subject: ['', [Validators.required, Validators.maxLength(100)]],
        message: ['', [Validators.required, Validators.maxLength(500)]],
      });
    }

    onSubmit() {
      if (this.contactForm.valid) {
        const { name, email, subject, message } = this.contactForm.value;
        window.location.href = `mailto:${this.myEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message + '\n\n My contact: ' + email + '\n\nBR,\n ' + name)}`;
        this.contactFormDirective.resetForm();
        this.contactForm.reset();
      }
    }
}
