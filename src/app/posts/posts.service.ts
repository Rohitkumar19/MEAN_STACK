import { Injectable } from "@angular/core";

import { Post } from "./post.model";
import { Subject } from 'rxjs'
import { map } from 'rxjs/operators'

import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + '/posts'
@Injectable({
  providedIn: 'root'
})

export class PostService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: any }>()

  getPosts(postPerPage, page) {
    let params = new HttpParams();
    params = params.append("pageSize", postPerPage);
    params = params.append("page", page)

    const url = BACKEND_URL
    this.http.get<{ message: string, posts: any, maxPosts: string }>(url, { params: params })
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              creator: post.creator,
              imagePath: post.imagePath
            };
          }),
          maxPosts: postData.maxPosts
        }
      }))
      .subscribe((transformedPost) => {
        console.log(transformedPost);
        this.posts = transformedPost.posts
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPost.maxPosts
        });
      })
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<any>(BACKEND_URL + "/" + id)
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title)
    this.http.post<{ message: string, post: Post }>(BACKEND_URL, postData).subscribe((resposne) => {

      this.router.navigate(["/"]);
    })
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append("id", id)
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title)
    } else {
      postData = { id: id, title: title, content: content, imagePath: image, creator: null };

    }
    this.http.put(BACKEND_URL + "/" + id, postData).subscribe((response) => {
      this.router.navigate(["/"]);
    })
  }

  deletePost(postId: String) {
    return this.http.delete(BACKEND_URL + "/" + postId);
  }
}
