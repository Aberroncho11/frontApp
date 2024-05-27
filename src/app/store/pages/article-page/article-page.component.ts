import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArticleService } from '../../services/articles.service';

@Component({
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.css']
})
export class ArticlePageComponent {

  private fb          = inject( FormBuilder );
  private articleService = inject( ArticleService );

  public articleForm: FormGroup = this.fb.group({
    description:    ['fernando@google.com', [ Validators.required, Validators.email ]],
    maker: ['123456', [ Validators.required, Validators.minLength(6) ]],
    weight: [0, [Validators.required]],
    height: [0, [Validators.required]],
    width: [0, [Validators.required]],
    price: [0, [Validators.required]],
    foto: [''],
    status: ['', [Validators.required]],
    stocks: [[], [Validators.required]]
  });

  // get() {
  //   const {email} = this.myForm.value;

  // }


}
