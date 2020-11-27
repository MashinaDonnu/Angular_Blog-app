import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from "../../shared/post.service";
import {Post} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  posts: Post[] = []
  postsSub: Subscription
  deleteSub: Subscription
  searchString = ''

  constructor(private postService: PostService, private alertService: AlertService) { }

  ngOnInit() {
    this.postsSub = this.postService.getAll().subscribe((posts: Post[]) => {
      this.posts = posts
      console.log(this.posts)
    })
  }

  remove(id: string) {
    this.deleteSub = this.postService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id)
    })
    this.alertService.danger('Post deleted')
  }

  ngOnDestroy(): void {
    if (this.postsSub) {
      this.postsSub.unsubscribe()
    }
  }
}
