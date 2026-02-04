import { animate, style, transition, trigger } from '@angular/animations';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterEvent, Event } from '@angular/router';
import { filter } from 'rxjs';
import { Link, SubLink } from './interfaces/app/model';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Star {
  top: string;
  left: string;
  delay: string;
  duration: string;
  size: string;
  isExploding?: boolean;
  hoverTimer?: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('openClose', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate(250, style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate(250, style({ transform: 'translateX(-100%)' }))
      ])
    ]),
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  stars: Star[] = [];
  private startsCount = 100; // Adjust for density

  @ViewChild('sidenav') sidenav: MatSidenav = null as any;

  public subLinksExist: boolean;
  lightTheme: boolean = true;
  mobileQuery: MediaQueryList;

  blogSubLinks: SubLink[]= [
    { name: '123', link: ''},
    { name: '123', link: ''},
    { name: '123', link: ''},
    { name: '123', link: ''},
  ];

  mainNavigationLinks: Link[] = [
    { name: 'Home', link: '' },
    //{ name: 'Blog', link: '/blog', subLinks: this.blogSubLinks },
    { name: 'Technologies', link: '/technologies' },
    { name: 'Portfolio',
      link: '/portfolio',
    subLinks: [
      { name: 'Budget', link: '/portfolio/budget/overview'},
    ] },
    { name: 'Contact', link: '/contact' },
  ];

  currentMainLinkId: number = 0;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private snackBar: MatSnackBar) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    this.mobileQuery.onchange = () => this.startsCount = this.mobileQuery.matches ? 100 : 200;

    if(!localStorage.getItem('theme'))
      this.setDefaultTheme();

      this.lightTheme = localStorage.getItem('theme') == 'light';
      this.lightTheme ? this.setTheme('light') : this.setTheme('dark');

    this.subLinksExist = false;
    this.router.events.pipe(
      filter((event: Event | RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
      ).subscribe((event) => {
        this.sidenav.close();
        let index = this.mainNavigationLinks.slice(1).findIndex(nl => event.url.includes(nl.link));
        this.currentMainLinkId = index + 1;
        this.subLinksExist = this.mainNavigationLinks[this.currentMainLinkId].subLinks != null;
    });
  }

  ngOnInit() {
    this.generateStars();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.generateStars();
  }

  generateStars() {
    this.stars = [];
    for (let i = 0; i < this.startsCount; i++) {
      this.stars.push({
        top: Math.random() * 95 + '%',
        left: Math.random() * 95 + '%',
        delay: Math.random() * 7 + 's',
        duration: 4 + Math.random() * 6 + 's',
        size: (Math.random() * 2 + 1) + 'px',
        isExploding: false
      });
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

private triggerBurst(star: Star) {
  star.isExploding = true;
  star.hoverTimer = null;

  setTimeout(() => {
    star.isExploding = false;
  }, 1000);
}

  changeMainLink(linkId: number) {
    this.router.navigate([this.mainNavigationLinks[linkId].link]);
  }

  changeSubLink(linkId: number, subLinkId: number) {
    let currentLink = this.mainNavigationLinks[linkId];
    let subLinks = currentLink.subLinks;
    let subLink = subLinks ? subLinks[subLinkId].link : '';
    this.router.navigate([subLink]);
  }

  toggleTheme() {
    this.lightTheme = !this.lightTheme;
    if (this.lightTheme) {
      this.setTheme('light');
    } else {
      this.setTheme('dark');
    }
  }

  //TODO: use cache to store selected theme
  private setDefaultTheme() {
    localStorage.setItem('theme', 'dark');
  }

  private setTheme(themeName: string) {
    document.documentElement.setAttribute('theme', themeName);
    localStorage.setItem('theme', themeName);
  }

  downloadResume() {
    const link = document.createElement('a');
    link.href = 'assets/CV.pdf';
    link.download = 'Lukas_Cwajna_Resume.pdf';
    link.click();
  }

  copyEmail() {
    this.snackBar.open('Email copied to clipboard!', undefined, { duration: 2000 })
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
