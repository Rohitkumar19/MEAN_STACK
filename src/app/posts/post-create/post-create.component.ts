import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, NG_ASYNC_VALIDATORS, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostService } from "../posts.service";
import { mimeType } from "./mime-type.validator";


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})

export class PostCreateComponent implements OnInit {
  enteredTitle: string = '';
  enteredContent: string = '';
  private mode = 'create';
  private postId: string;
  post: Post;
  form: FormGroup
  isLoading: boolean = false;
  imgPreview: string;
  @Output() postCreated = new EventEmitter<Post>();

  constructor(private postService: PostService,
    private route: ActivatedRoute,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((post: any) => {
          this.isLoading = false;
          this.post = {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
            creator: post.creator
          }
          this.form.get('title').patchValue(post.title);
          this.form.get('content').patchValue(post.content)
          this.form.get('image').patchValue(this.post.imagePath)
        })
      } else {
        this.mode = 'create';
        this.postId = null
      }
    })
  }

  createForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', Validators.required],
    })
    this.form.addControl('image', new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }))
  }

  onSavePost() {
    if (!this.form.invalid) {
      const post: Post = {
        title: this.form.value.title,
        content: this.form.value.content,
        imagePath: null
      };
      if (this.mode === 'create') {
        this.postService.addPost(post.title, post.content, this.form.value.image);
      } else {
        this.postService.updatePost(this.postId, post.title, post.content, this.form.value.image)
      }
      this.form.reset()
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.get('image').patchValue(file);
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}
