import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NewsFeedService } from '../news-feed.service';
import { storyDetails } from '../story-details';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { error } from 'console';
import { catchError, finalize, map, merge, tap, throwError } from 'rxjs';
import { subscribe } from 'diagnostics_channel';
import { ActivatedRoute } from '@angular/router';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrl: './stories.component.scss',
})
export class StoriesComponent implements OnInit, AfterViewInit {
  httpClient = inject(HttpClient);
  loading = false;
  sort!: MatSort;
  paginator!: MatPaginator;
  stories: storyDetails[] = [];
  totalItems: number = 0;
  pageSize = 10;
  currentPage = 0;
  dataSource!: MatTableDataSource<storyDetails>;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }

  constructor(
    private feedService: NewsFeedService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  columns: string[] = [
    'title',
    'url',
  ];

  ngOnInit(): void {
    this.feedService.getStoriesCount().subscribe((res) => {
      this.totalItems = res;
    });
    this.fetchData();
  }
  ngAfterViewInit() {}

  fetchData() {
    this.loading = true;
    this.feedService
      .findStories(
        'asc',
        this.paginator?.pageIndex ?? 1,
        this.paginator?.pageSize ?? 3
      )
      .pipe(
        tap((stories) => (this.stories = stories)),
        catchError((err) => {
          console.log('Error loading stories', err);
          return throwError(err);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res);
      });
  }

  onPageChange(event: PageEvent) {
    this.fetchData();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    var filteredData = this.stories.filter((data) =>
      data.title.toLowerCase().includes(filterValue.toLowerCase())
    );
    this.dataSource = new MatTableDataSource(filteredData);
  }
}
