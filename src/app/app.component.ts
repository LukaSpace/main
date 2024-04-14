import { animate, state, style, transition, trigger } from '@angular/animations';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ViewChild, } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent, Event } from '@angular/router';
import { filter } from 'rxjs';

export interface Link {
  name: string,
  link: string,
  subLinks: SubLink[]
}

export interface SubLink {
  name: string,
  link: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
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
export class AppComponent {

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
    { name: 'Home', link: '', subLinks: []},
    { name: 'Blog', link: '/blog', subLinks: this.blogSubLinks },
    { name: 'Contact', link: '/contact', subLinks: [] },
  ];

  currentMainLinkId: number = 0;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    this.toggleTheme();
    this.subLinksExist = false;
    this.router.events.pipe(
      filter((event: Event | RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
      ).subscribe((event) => {
        this.sidenav.close();
        let index = this.mainNavigationLinks.slice(1).findIndex(nl => event.url.includes(nl.link));
        this.currentMainLinkId = index + 1;
        this.subLinksExist = this.mainNavigationLinks[this.currentMainLinkId].subLinks.length > 0;
    });
  }

  changeMainLink(linkId: number) {
    this.router.navigate([this.mainNavigationLinks[linkId].link]);
  }

  changeSubLink(subLinkId: number) {
    let currentLink = this.mainNavigationLinks[this.currentMainLinkId];
    let subLink = currentLink.subLinks[subLinkId].link;
    this.router.navigate([currentLink.link + subLink]);
  }

  toggleTheme() {
    this.lightTheme = !this.lightTheme;
    if (this.lightTheme) {
      document.documentElement.setAttribute('theme', 'light');
    } else {
      document.documentElement.setAttribute('theme', 'dark');
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
