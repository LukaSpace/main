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
    standalone: false
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('iconElement') iconElements!: QueryList<ElementRef>;
  @ViewChild('sphereContainer') sphereContainer!: ElementRef;

  @HostListener('window:resize')
  onResize() {
    this.rerunAnimationOfSphere();
  }

  // sphere related
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
  private baseRotationSpeedY = 1;
  private baseRotationSpeedX = 0.5;
  private maxAngularSpeed = 2;
  private radius = 150;
  private isHovering = false;
  private lastX = 0;
  private lastY = 0;
  private animationId?: number;
  private iconElementsArray: HTMLElement[] = [];
  private basePositions: { x: number; y: number; z: number }[] = [];
  private lastTimestamp?: number;

  // roles typing related
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
    this.iconElementsArray = this.iconElements.map(el => el.nativeElement);
    this.computeBasePositions();
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
    this.computeBasePositions();

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.ngZone.runOutsideAngular(() => {
      this.animationId = requestAnimationFrame(t => this.animateSphere(t));
    });
  }

  private computeBasePositions(): void {
    const total = this.icons.length;
    this.basePositions = [];
    for (let i = 0; i < total; i++) {
      const phi = Math.acos(-1 + (2 * i) / total);
      const theta = Math.sqrt(total * Math.PI) * phi;
      const x = this.radius * Math.cos(theta) * Math.sin(phi);
      const y = this.radius * Math.sin(theta) * Math.sin(phi);
      const z = this.radius * Math.cos(phi);
      this.basePositions.push({ x, y, z });
    }
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

  private animateSphere(timestamp: number): void {
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      this.animationId = requestAnimationFrame(t => this.animateSphere(t));
      return;
    }

    const delta = Math.min(60, timestamp - this.lastTimestamp);
    const deltaFactor = delta / 16;

    const baseY = this.isHovering ? 0 : this.baseRotationSpeedY * this.rotateDirection;
    const baseX = this.isHovering ? 0 : this.baseRotationSpeedX * this.rotateDirection;

    let combinedY = baseY + this.velocityY;
    let combinedX = baseX + this.velocityX;

    combinedY = Math.max(-this.maxAngularSpeed, Math.min(this.maxAngularSpeed, combinedY));
    combinedX = Math.max(-this.maxAngularSpeed, Math.min(this.maxAngularSpeed, combinedX));

    this.rotationY += combinedY * deltaFactor;
    this.rotationX += combinedX * deltaFactor;

    this.updateIconPositions();

    const damping = this.isHovering ? 0.96 : 0.9;
    this.velocityX *= Math.pow(damping, deltaFactor);
    this.velocityY *= Math.pow(damping, deltaFactor);

    this.lastTimestamp = timestamp;
    this.animationId = requestAnimationFrame(t => this.animateSphere(t));
  }

  private updateIconPositions(): void {
    const rx = (this.rotationX * Math.PI) / 180;
    const ry = (this.rotationY * Math.PI) / 180;
    const sinRx = Math.sin(rx);
    const cosRx = Math.cos(rx);
    const sinRy = Math.sin(ry);
    const cosRy = Math.cos(ry);

    for (let i = 0; i < this.iconElementsArray.length; i++) {
      const el = this.iconElementsArray[i];
      const { x: x0, y: y0, z: z0 } = this.basePositions[i];

      const y1 = y0 * cosRx - z0 * sinRx;
      const z1 = y0 * sinRx + z0 * cosRx;

      const x2 = x0 * cosRy + z1 * sinRy;
      const z2 = -x0 * sinRy + z1 * cosRy;

      const scale = ((z2 + this.radius) / (2 * this.radius)) * 0.6 + 0.6;
      el.style.transform = `translate(-50%, -50%) translate3d(${x2}px, ${y1}px, ${z2}px) scale(${scale})`;
      el.style.zIndex = String(Math.round(z2 + this.radius));
      el.style.opacity = (0.3 + ((z2 + this.radius) / (2 * this.radius)) * 0.7).toString();
    }
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
