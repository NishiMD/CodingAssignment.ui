import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { storyDetails } from './story-details';

@Injectable({
  providedIn: 'root',
})
export class NewsFeedService {
  private apiUrl = 'https://newsfeedapi20240711001216.azurewebsites.net/api/NewsFeed/GetStories';
  private pageapiUrl = 'https://newsfeedapi20240711001216.azurewebsites.net/api/NewsFeed/GetPagedStories';

  constructor(private http: HttpClient) {}

  getStoriesCount(): Observable<number> {
    return this.http.get<number>(this.apiUrl);
  }

  findStories(
    sortOrder = 'asc',
    pageNumber = 0,
    pageSize = 3
  ): Observable<storyDetails[]> {
    return this.http
      .get<storyDetails[]>(this.pageapiUrl, {
        params: new HttpParams()
          .set('sortOrder', sortOrder)
          .set('pageNumber', pageNumber.toString())
          .set('pageSize', pageSize.toString()),
      })
      .pipe(map((res) => res));
  }
}
