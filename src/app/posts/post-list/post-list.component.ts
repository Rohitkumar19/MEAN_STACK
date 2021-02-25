import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  totalPosts: number = 0;
  postsPerPage = 2;
  currentPage: number = 1;
  userId: string;
  private authSub: Subscription;
  userIsAuthenticated: boolean = false
  pageSizeOptions = [1, 2, 5, 10]
  private postSub: Subscription
  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId()
    this.postSub = this.postService.getPostUpdateListener().subscribe((postData: { posts: Post[], postCount: number }) => {
      this.posts = postData.posts;
      this.totalPosts = postData.postCount
    })
    this.subscribToAuthStatus()
  }

  subscribToAuthStatus() {
    this.authSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    })
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage)
    })
  }

  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  routeToEdit(id) {
    this.router.navigate(["/edit/" + id])
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authSub.unsubscribe();
  }

}
