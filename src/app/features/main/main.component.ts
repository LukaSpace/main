import { animate, style, transition, trigger } from '@angular/animations';
import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
interface IconPoint {
  x: number;
  y: number;
  z: number;
  tech: string;
}

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
export class MainComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChildren('iconElement') iconElements!: QueryList<ElementRef>;
  @ViewChild('sphereContainer') sphereContainer!: ElementRef;

  iconsData: string[] = [
    'javascript', 'typescript', 'angular', 'nodedotjs', 'ngrx',
    'tailwindcss', 'css', 'html5',
    'docker', 'kubernetes', 'xml', 'git', 'dotnet',
    'github', 'githubactions', 'githubcopilot'
  ];

  points: IconPoint[] = [];
  radius = 250;
  rotationX = 0;
  rotationY = 0;
  targetRotationX = 0.005;
  targetRotationY = 0.005;
  animationId?: number;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(private ngZone: NgZone, changeDetectorRef: ChangeDetectorRef,
      media: MediaMatcher,) {
    // this.mobileQuery = media.matchMedia('(max-width: 1000px)');
    // this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    // this.mobileQuery.onchange = () => {
    //   this.radius = this.mobileQuery.matches ? 150 : 250;
    //   this.points = [];
    //   this.generateSpherePoints();
    //   this.ngZone.runOutsideAngular(() => {
    //   this.animate();
    // });
    // }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.recalculateRadius();
    this.generateSpherePoints();
    this.runAnimation();
  }

  recalculateRadius() {
    this.radius = this.sphereContainer?.nativeElement.getBoundingClientRect().width / 2.5 || 250;
  }

  runAnimation() {
    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.recalculateRadius();
    this.generateSpherePoints();
    this.runAnimation();
  }
    
  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  downloadResume() {
    const link = document.createElement('a');
    link.href = 'assets/CV.pdf';
    link.download = 'Lukas_Cwajna_Resume.pdf';
    link.click();
  }

  generateSpherePoints() {
    this.points = [];
    const count = this.iconsData.length;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      this.points.push({
        x: this.radius * Math.cos(theta) * Math.sin(phi),
        y: this.radius * Math.sin(theta) * Math.sin(phi),
        z: this.radius * Math.cos(phi),
        tech: this.iconsData[i]
      });
    }
  }

  onMouseMove(e: MouseEvent) {
    const dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

    this.targetRotationY = dx * 0.01;
    this.targetRotationX = -dy * 0.01;
  }

  animate() {
    this.rotationX += this.targetRotationX;
    this.rotationY += this.targetRotationY;

    const nativeElements = this.iconElements.toArray();

    this.points.forEach((point, i) => {
      const el = nativeElements[i].nativeElement;

      let currentY = point.y * Math.cos(this.rotationX) - point.z * Math.sin(this.rotationX);
      let currentZ = point.y * Math.sin(this.rotationX) + point.z * Math.cos(this.rotationX);

      let finalX = point.x * Math.cos(this.rotationY) + currentZ * Math.sin(this.rotationY);
      let finalY = currentY;
      let finalZ = -point.x * Math.sin(this.rotationY) + currentZ * Math.cos(this.rotationY);

      const scale = (finalZ + this.radius) / (2 * this.radius) * 0.5 + 0.5;
      const opacity = (finalZ + this.radius) / (2 * this.radius) * 0.8 + 0.2;

      el.style.transform = `translate3d(${finalX}px, ${finalY}px, ${finalZ}px) scale(${scale})`;
      el.style.opacity = opacity.toString();
      el.style.zIndex = Math.round(finalZ + this.radius).toString();
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}