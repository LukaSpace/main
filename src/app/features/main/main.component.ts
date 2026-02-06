import { animate, style, transition, trigger } from '@angular/animations';
import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
interface IconPoint {
  x: number;
  y: number;
  z: number;
  tech: string;
}
const maxRotationSpeed = 0.008;

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate(250, style({ transform: 'translateY(0)' }))
      ]),
    ]),
  ],
})
export class MainComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('iconElement') iconElements!: QueryList<ElementRef>;
  @ViewChild('sphereContainer') sphereContainer!: ElementRef;

  icons: string[] = [
    'javascript', 'typescript', 'angular', 'nodedotjs', 'ngrx',
    'tailwindcss', 'css', 'html5',
    'docker', 'kubernetes', 'xml', 'git', 'dotnet',
    'github', 'githubactions', 'githubcopilot'
  ];
  phrases: string[] = ['Full Stack Developer', 'Problem Solver', 'Concept Creator'];
  displayText: string = '';

  rotationX = -10;
  rotationY = 0;
  velocityX = 0;
  velocityY = 0;
  maxSpeed = 0.8;
  rotateDirection = 1; // 1 or -1
  baseRotationSpeedY = 2; // degrees per frame (tweak to taste)
  baseRotationSpeedX = 1;    // small tilt if desired, e.g. 0.02
  maxAngularSpeed = 15; // degrees/frame, hard cap for combined rotation

  private isHovering = false;
  private lastX = 0;
  private lastY = 0;
  private radius = 150;
  private animationId?: number;

  private phraseIndex: number = 0;
  private charIndex: number = 0;
  private isDeleting: boolean = false;
  private typingTimer: any;
  private readonly typeBase = 40;
  private readonly typeJitter = 60;
  private readonly eraseSpeed = 25;
  private readonly waitTime = 1200;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(private ngZone: NgZone, changeDetectorRef: ChangeDetectorRef,
      media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.handleTyping();
   }

  ngAfterViewInit(): void {
    this.rerunAnimation();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    if (this.typingTimer) clearTimeout(this.typingTimer);
  }

   downloadResume() {
    const link = document.createElement('a');
    link.href = 'assets/CV.pdf';
    link.download = 'Lukas_Cwajna_Resume.pdf';
    link.click();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.rerunAnimation();
  }

  private rerunAnimation() {
    this.radius = (this.sphereContainer?.nativeElement?.getBoundingClientRect().width ?? 0) / 3.2;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });
  }

  // Trigger only inside the sphere
  onMouseDownInside(event: MouseEvent) {
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  // Mouse enters interactive zone
  onMouseEnter(event: MouseEvent) {
    this.isHovering = true;
    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  // Mouse leaves — stop capturing movement
  onMouseLeave(_event?: MouseEvent) {
    this.isHovering = false;
    // let velocities decay in animate() — don't abruptly snap
  }

  // Mouse move restricted to hover area
  onMouseMoveInside(event: MouseEvent) {
    if (!this.isHovering) return;

    const dx = event.clientX - this.lastX;
    const dy = event.clientY - this.lastY;

    // set direction from horizontal movement
    if (dx !== 0) this.rotateDirection = dx > 0 ? 1 : -1;

    // sensitivity and smoothing
    const sensitivity = 0.05;
    const targetY = dx * sensitivity;
    const targetX = -dy * sensitivity * 0.5;

    // smooth toward target and clamp
    this.velocityY = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.velocityY * 0.8 + targetY * 0.2));
    this.velocityX = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.velocityX * 0.8 + targetX * 0.2));

    this.lastX = event.clientX;
    this.lastY = event.clientY;
  }

  animate() {
    const icons = this.iconElements ? this.iconElements.toArray() : [];
    const total = icons.length;

    // compute combined rotations but clamp to avoid runaway speed
    let combinedY = (this.baseRotationSpeedY * this.rotateDirection) + this.velocityY;
    let combinedX = (this.baseRotationSpeedX * this.rotateDirection) + this.velocityX;

    combinedY = Math.max(-this.maxAngularSpeed, Math.min(this.maxAngularSpeed, combinedY));
    combinedX = Math.max(-this.maxAngularSpeed, Math.min(this.maxAngularSpeed, combinedX));

    this.rotationY += combinedY;
    this.rotationX += combinedX;

    const rx = this.rotationX * Math.PI / 180;
    const ry = this.rotationY * Math.PI / 180;

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

    // stronger damping when mouse isn't over the sphere
    if (!this.isHovering) {
      this.velocityX *= 0.9;
      this.velocityY *= 0.9;
    } else {
      this.velocityX *= 0.96;
      this.velocityY *= 0.96;
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  calculatePosition(i: number, total: number) {
    const phi = Math.acos(-1 + (2 * i) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;

    const x = this.radius * Math.cos(theta) * Math.sin(phi);
    const y = this.radius * Math.sin(theta) * Math.sin(phi);
    const z = this.radius * Math.cos(phi);

    return {
      transform: `translate3d(${x}px, ${y}px, ${z}px)`
    };
  }

  handleTyping() {
    const currentPhrase = this.phrases[this.phraseIndex];
    
    if (!this.isDeleting) {
      this.displayText = currentPhrase.substring(0, this.charIndex + 1);
      this.charIndex++;
    } else {
      this.displayText = currentPhrase.substring(0, this.charIndex - 1);
      this.charIndex--;
    }

    // CALCULATE NEXT DELAY
    let nextStepDelay: number;

    if (this.isDeleting) {
      nextStepDelay = this.eraseSpeed;
    } else {
      // Randomized "Human" typing: Base speed + random variation
      nextStepDelay = this.typeBase + Math.random() * this.typeJitter;
    }

    // State switching logic
    if (!this.isDeleting && this.charIndex === currentPhrase.length) {
      nextStepDelay = this.waitTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      nextStepDelay = 300; 
    }

    this.typingTimer = setTimeout(() => this.handleTyping(), nextStepDelay);
  }
}