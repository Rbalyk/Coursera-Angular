import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {Params, ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {Dish} from '../shared/dish';
import {DishService} from '../services/dish.service';
import {switchMap} from 'rxjs/operators';
import {Comment} from '../shared/comment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { visibility } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    visibility()
  ]
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;
  comment: Comment;
  comments: Comment[];
  commentForm: FormGroup;
  date: string;
  autoTicks = false;
  max = 5;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = true;
  value = 5;
  tickIntervalNumber = 1;
  dishCopy: Dish;
  visibility = 'shown';

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this.tickIntervalNumber) : 0;
  }

  // @ts-ignore
  @ViewChild('commForm') commentFormDirective;
  formErrors = {
    author: '',
    comment: ''
  };
  validationMessages = {
    author: {
      required: 'Author Name is required.',
      minlength: 'Author Name must be at least 2 characters long.',
      maxlength: 'Author cannot be more than 25 characters long.'
    },
    comment: {
      required: 'Comment is required.',
      minlength: 'Comment must be at least 2 characters long.',
      maxlength: 'Comment cannot be more than 500 characters long.'
    }
  };

  constructor(private dishService: DishService,
              private location: Location,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              @Inject('BaseURL') private BaseURL) {
    this.createForm();
  }

  createForm() {
    this.commentForm = this.fb.group({
      rating: 1,
      comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]],
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      date: '',
    });
    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
    this.date = new Date().toDateString();
    this.commentForm.get('date').setValue(this.date);
  }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(+params['id']); }))
      .subscribe(
        dish => {
          this.dish = dish;
          this.dishCopy = dish;
          this.setPrevNext(dish.id);
          this.visibility = 'shown';
          this.comments = dish.comments;
        },
        errorMessage => this.errMess = errorMessage as any);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  onSubmit() {
    this.comment = (this.commentForm.value);
    this.commentForm.get('date').setValue(this.date);
    this.dishCopy.comments.push(this.comment);
    this.dishService.putDish(this.dishCopy)
      .subscribe(dish => {
          this.dish = dish;
          this.dishCopy = dish;
        },
        errorMessage => {
          this.dish = null;
          this.dishCopy = null;
          this.errMess = errorMessage as any;
        });
    this.commentForm.reset();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) {
      return;
    }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  goBack(): void {
    this.location.back();
  }
}
