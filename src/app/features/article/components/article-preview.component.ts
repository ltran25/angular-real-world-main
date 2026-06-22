import { Component, Input } from "@angular/core";
import { Article } from "../models/article.model";
import { ArticleMetaComponent } from "./article-meta.component";
import { RouterLink } from "@angular/router";
import { NgForOf } from "@angular/common";
import { FavoriteButtonComponent } from "./favorite-button.component";

@Component({
  selector: "app-article-preview",
  template: `
    <div class="article-preview">
      <app-article-meta [article]="article">
        <app-favorite-button
          [article]="article"
          (toggle)="toggleFavorite($event)"
          class="pull-xs-right"
        >
          {{ article.favoritesCount }}
        </app-favorite-button>
      </app-article-meta>

      <a [routerLink]="['/article', article.slug]" class="preview-link">
        <h1>{{ article.title }}</h1>
        <p>{{ article.description }}</p>
        <span>Read more...</span>
        <ul class="tag-list">
          @for (tag of article.tagList; track tag) {
            <li class="tag-default tag-pill tag-outline">
              {{ tag }}
            </li>
          }
        </ul>
      </a>
    </div>
  `,
  imports: [ArticleMetaComponent, FavoriteButtonComponent, RouterLink, NgForOf],
  standalone: true,
})
export class ArticlePreviewComponent {
  @Input() article!: Article;

  toggleFavorite(favorited: boolean): void {
    this.article.favorited = favorited;

    if (favorited) {
      console.log(`Article "${this.article.title}" (${this.article.slug}) favorited. New count: ${this.article.favoritesCount + 1}`);
      this.article.favoritesCount++;
    } else {
      console.log(`Article "${this.article.title}" (${this.article.slug}) unfavorited. New count: ${this.article.favoritesCount - 1}`);
      this.article.favoritesCount--;
    }
  }
}
