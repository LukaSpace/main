import { ChangeDetectorRef, Component } from '@angular/core';
import { Link } from '../../../interfaces/app/model';
import { MediaMatcher } from '@angular/cdk/layout';
import { NavigationEnd, Router, RouterEvent, Event} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'budget',
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
})
export class BudgetComponent {
  mobileQuery: MediaQueryList;

  mainNavigationLinks: Link[] = [
    { name: 'Overview', link: 'portfolio/budget/overview' },
    { name: 'List', link: 'portfolio/budget/list' },
    // { name: 'Edit', link: 'portfolio/budget/edit' },
    // { name: 'Graphs', link: 'portfolio/budget/graphs' },
  ];

  currentMainLinkId: number = 0;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    this.router.events.pipe(
      filter((event: Event | RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
      ).subscribe((event) => {
        let index = this.mainNavigationLinks.slice(1).findIndex(nl => event.url.includes(nl.link));
        this.currentMainLinkId = index + 1;
    });
  }

  changeMainLink(linkId: number) {
    this.router.navigate([this.mainNavigationLinks[linkId].link]);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}