import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterEvent, Event } from '@angular/router';
import { filter } from 'rxjs';
import { Link, Star } from './interfaces/app/model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from '../shared/services/local-storage/local-storage.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: MatSidenav = null as any;

  @HostListener('window:resize')
  onResize() {
    this.generateStars();
  }

  private startsCount = 100;

  stars: Star[] = [];
  currentYear: number = new Date().getFullYear();
  lightTheme = true;
  mobileQuery: MediaQueryList;
  currentMainLinkId = 0;

  mainNavigationLinks: Link[] = [
    { name: 'Home', link: '' },
    { name: 'Technologies', link: '/technologies' },
    { name: 'Portfolio', link: '/portfolio' },
    { name: 'Contact', link: '/contact' },
  ];

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private snackBar: MatSnackBar,
    private storageService: LocalStorageService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    this.mobileQuery.onchange = () => (this.startsCount = this.mobileQuery.matches ? 100 : 200);

    this.router.events.pipe(filter((event: Event | RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(event => {
      this.sidenav.close();
      const index = this.mainNavigationLinks.slice(1).findIndex(nl => event.url.includes(nl.link));
      this.currentMainLinkId = index + 1;
    });
  }

  ngOnInit() {
    this.setDefaultTheme();
    this.generateStars();
  }

  private adjustTheme() {
    if (!this.storageService.getData('theme')) this.setDefaultTheme();

    this.lightTheme = this.storageService.getData('theme') == 'light';
    if (this.lightTheme) {
      this.setTheme('dark');
    } else {
      this.setTheme('dark');
    }
  }

  generateStars() {
    this.stars = [];
    for (let i = 0; i < this.startsCount; i++) {
      const star: Star = {
        top: Math.random() * 95 + '%',
        left: Math.random() * 95 + '%',
        delay: Math.random() * 7 + 's',
        duration: 4 + Math.random() * 6 + 's',
        size: Math.random() * 2 + 1 + 'px',
        isExploding: false,
      };
      const loopTime = (i + 1) * 15000;
      star.hoverTimer = setTimeout(() => {
        this.triggerBurst(star, loopTime);
      }, loopTime);
      this.stars.push(star);
    }
  }

  onStarHover(star: Star) {
    if (star.isExploding) return;

    star.hoverTimer = setTimeout(() => {
      this.triggerBurst(star);
    }, 500);
  }

  onStarLeave(star: Star) {
    if (star.hoverTimer) {
      clearTimeout(star.hoverTimer);
      star.hoverTimer = null;
    }
  }

  changeMainLink(linkId: number) {
    this.router.navigate([this.mainNavigationLinks[linkId].link]);
  }

  toggleTheme() {
    this.lightTheme = !this.lightTheme;
    if (this.lightTheme) {
      this.setTheme('light');
    } else {
      this.setTheme('dark');
    }
  }

  copyEmail() {
    this.snackBar.open('Email copied to clipboard!', undefined, {
      duration: 2000,
    });
  }

  private setDefaultTheme() {
    this.setTheme('dark');
  }

  private setTheme(themeName: string) {
    document.documentElement.setAttribute('theme', themeName);
    this.storageService.saveData('theme', themeName);
  }

  private triggerBurst(star: Star, loopTime?: number) {
    star.isExploding = true;
    star.hoverTimer = null;

    setTimeout(() => {
      star.isExploding = false;
    }, 1000);

    if (loopTime) {
      star.hoverTimer = setTimeout(() => {
        this.triggerBurst(star, loopTime + 2000);
      }, loopTime + 2000);
    }
  }

  private _mobileQueryListener: () => void;

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
