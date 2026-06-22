import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from "@angular/core";
import { Router } from "@angular/router";
import { EMPTY, switchMap } from "rxjs";
import { NgClass } from "@angular/common";
import { ArticlesService } from "../services/articles.service";
import { UserService } from "../../../core/auth/services/user.service";
import { Article } from "../models/article.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-favorite-button",
  template: `
    <button
      class="btn btn-sm"
      [ngClass]="{
        disabled: isSubmitting,
        'btn-outline-primary': !article.favorited,
        'btn-primary': article.favorited
      }"
      (click)="toggleFavorite()"
    >
      <i class="ion-heart"></i> <ng-content></ng-content>
    </button>
  `,
  imports: [NgClass],
  standalone: true,
})
export class FavoriteButtonComponent {
  destroyRef = inject(DestroyRef);
  isSubmitting = false;

  @Input() article!: Article;
  @Output() toggle = new EventEmitter<boolean>();

  constructor(
    private readonly articleService: ArticlesService,
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  toggleFavorite(): void {
    this.isSubmitting = true;
    
    // Log the favorite action being initiated
    console.log(`Toggle favorite for article: ${this.article.slug}, current state: ${this.article.favorited ? 'favorited' : 'not favorited'}`);

    this.userService.isAuthenticated
      .pipe(
        switchMap((authenticated) => {
          if (!authenticated) {
            console.log('User not authenticated, redirecting to register');
            void this.router.navigate(["/register"]);
            return EMPTY;
          }

          if (!this.article.favorited) {
            console.log(`Calling favorite for: ${this.article.slug}`);
            return this.articleService.favorite(this.article.slug);
          } else {
            console.log(`Calling unfavorite for: ${this.article.slug}`);
            return this.articleService.unfavorite(this.article.slug);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          console.log(`Successfully ${!this.article.favorited ? 'favorited' : 'unfavorited'} article: ${this.article.slug}`);
          this.toggle.emit(!this.article.favorited);
        },
        error: (err) => {
          console.error(`Failed to toggle favorite for ${this.article.slug}:`, err);
          this.isSubmitting = false;
        },
      });
  }
}
