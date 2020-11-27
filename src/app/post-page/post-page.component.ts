import { Component, OnInit } from '@angular/core';
import {PostService} from "../shared/post.service";
import {ActivatedRoute} from "@angular/router";
import {Post} from "../shared/interfaces";

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {

  post: Post

  constructor(private route: ActivatedRoute, private postService: PostService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.postService.getById(params['id']).subscribe(post => {
        this.post = post
      })
    })

  }

}
