import { animate, style, transition, trigger } from '@angular/animations';
import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogResult } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  animations: [trigger('openClose', [transition(':enter', [style({ transform: 'translateY(-100%)' }), animate(250, style({ transform: 'translateY(0)' }))])])],
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('iconElement') iconElements!: QueryList<ElementRef>;
  @ViewChild('sphereContainer') sphereContainer!: ElementRef;

  @HostListener('window:resize')
  onResize() {
    this.rerunAnimationOfSphere();
  }

  //sphere related
  icons: string[] = [
    'javascript',
    'typescript',
    'angular',
    'nodedotjs',
    'ngrx',
    'tailwindcss',
    'css',
    'html5',
    'docker',
    'kubernetes',
    'xml',
    'git',
    'dotnet',
    'github',
    'githubactions',
    'githubcopilot',
  ];
  displayText = '';
  private rotationX = -10;
  private rotationY = 0;
  private velocityX = 0;
  private velocityY = 0;
  private maxSpeed = 0.8;
  private rotateDirection = 1;
  private baseRotationSpeedY = 2;
  private baseRotationSpeedX = 1;
  private maxAngularSpeed = 15;
  private radius = 150;
  private isHovering = false;
  private lastX = 0;
  private lastY = 0;
  private animationId?: number;

  //roles typing related
  roles: string[] = ['Full Stack Developer', 'Problem Solver', 'Concept Creator'];
  private phraseIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private typingTimer: any;
  private readonly typeBase = 60;
  private readonly typeJitter = 80;
  private readonly eraseSpeed = 45;
  private readonly waitTime = 1800;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private ngZone: NgZone,
    private dialog: MatDialog,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.handleTyping();
  }

  ngAfterViewInit(): void {
    this.rerunAnimationOfSphere();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    if (this.typingTimer) clearTimeout(this.typingTimer);
  }

  downloadResume() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Select language:',
        leftText: 'PL',
        rightText: 'ENG',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      let href = '';
      let fileName = '';

      if (result === ConfirmDialogResult.Left) {
        href = 'assets/CV.pdf';
        fileName = 'Lukas_Cwajna_Resume_PL.pdf';
      } else if (result === ConfirmDialogResult.Right) {
        href = 'assets/CV - ENG.pdf';
        fileName = 'Lukas_Cwajna_Resume_ENG.pdf';
      } else {
        return;
      }

      const link = document.createElement('a');
      link.href = href;
      link.download = fileName;
      link.click();
    });
  }

  private rerunAnimationOfSphere() {
    this.radius = (this.sphereContainer?.nativeElement?.getBoundingClientRect().width ?? 0) / 3.2;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.ngZone.runOutsideAngular(() => {
      this.animateSphere();
    });
  }

  onMouseDownInside(event: MouseEvent) {
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  onMouseEnter(event: MouseEvent) {
    this.isHovering = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  onMouseLeave() {
    this.isHovering = false;
  }

  onMouseMoveInside(event: MouseEvent) {
    if (!this.isHovering) return;

    const dx = event.clientX - this.lastX;
    const dy = event.clientY - this.lastY;

    if (dx !== 0) this.rotateDirection = dx > 0 ? 1 : -1;

    const sensitivity = 0.05;
    const targetY = dx * sensitivity;
    const targetX = -dy * sensitivity * 0.5;

    this.velocityY = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.velocityY * 0.8 + targetY * 0.2));
    this.velocityX = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.velocityX * 0.8 + targetX * 0.2));

    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  animateSphere() {
    const icons = this.iconElements ? this.iconElements.toArray() : [];
    const total = icons.length;

    let combinedY = this.baseRotationSpeedY * this.rotateDirection + this.velocityY;
    let combinedX = this.baseRotationSpeedX * this.rotateDirection + this.velocityX;

    combinedY = Math.max(-this.maxAngularSpeed, Math.min(this.maxAngularSpeed, combinedY));
    combinedX = Math.max(-this.maxAngularSpeed, Math.min(this.maxAngularSpeed, combinedX));

    this.rotationY += combinedY;
    this.rotationX += combinedX;

    const rx = (this.rotationX * Math.PI) / 180;
    const ry = (this.rotationY * Math.PI) / 180;

    for (let i = 0; i < total; i++) {
      const el = icons[i].nativeElement as HTMLElement;
      const phi = Math.acos(-1 + (2 * i) / total);
      const theta = Math.sqrt(total * Math.PI) * phi;
      const x0 = this.radius * Math.cos(theta) * Math.sin(phi);
      const y0 = this.radius * Math.sin(theta) * Math.sin(phi);
      const z0 = this.radius * Math.cos(phi);

      const y1 = y0 * Math.cos(rx) - z0 * Math.sin(rx);
      const z1 = y0 * Math.sin(rx) + z0 * Math.cos(rx);
      const x2 = x0 * Math.cos(ry) + z1 * Math.sin(ry);
      const z2 = -x0 * Math.sin(ry) + z1 * Math.cos(ry);

      const scale = ((z2 + this.radius) / (2 * this.radius)) * (1.2 - 0.6) + 0.6;

      el.style.transform = `translate(-50%, -50%) translate3d(${x2}px, ${y1}px, ${z2}px) scale(${scale})`;
      el.style.zIndex = String(Math.round(z2 + this.radius));
      el.style.opacity = (0.3 + ((z2 + this.radius) / (2 * this.radius)) * 0.7).toString();
    }

    if (!this.isHovering) {
      this.velocityX *= 0.9;
      this.velocityY *= 0.9;
    } else {
      this.velocityX *= 0.96;
      this.velocityY *= 0.96;
    }

    this.animationId = requestAnimationFrame(() => this.animateSphere());
  }

  calculatePosition(i: number, total: number) {
    const phi = Math.acos(-1 + (2 * i) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;

    const x = this.radius * Math.cos(theta) * Math.sin(phi);
    const y = this.radius * Math.sin(theta) * Math.sin(phi);
    const z = this.radius * Math.cos(phi);

    return {
      transform: `translate3d(${x}px, ${y}px, ${z}px)`,
    };
  }

  handleTyping() {
    const currentPhrase = this.roles[this.phraseIndex];

    if (!this.isDeleting) {
      this.displayText = currentPhrase.substring(0, this.charIndex + 1);
      this.charIndex++;
    } else {
      this.displayText = currentPhrase.substring(0, this.charIndex - 1);
      this.charIndex--;
    }

    let nextStepDelay: number;

    if (this.isDeleting) {
      nextStepDelay = this.eraseSpeed;
    } else {
      nextStepDelay = this.typeBase + Math.random() * this.typeJitter;
    }

    if (!this.isDeleting && this.charIndex === currentPhrase.length) {
      nextStepDelay = this.waitTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.phraseIndex = (this.phraseIndex + 1) % this.roles.length;
      nextStepDelay = 300;
    }

    this.typingTimer = setTimeout(() => this.handleTyping(), nextStepDelay);
  }
}
