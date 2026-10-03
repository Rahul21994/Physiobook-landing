import { Link } from "wouter";
import {
  BLOG_AUTHOR_PROFILE,
  BLOG_REVIEWER_PROFILE,
  type BlogAuthorProfile,
} from "@/lib/content-profiles";

type ContentAttributionProps = {
  authorProfile?: BlogAuthorProfile;
  testId?: string;
  className?: string;
  showCredentials?: boolean;
};

export function ContentAttribution({
  authorProfile = BLOG_AUTHOR_PROFILE,
  testId = "content-attribution",
  className = "",
  showCredentials = false,
}: ContentAttributionProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground ${className}`}
      data-testid={testId}
      aria-label="Content attribution"
    >
      <span>
        Written by{" "}
        <Link
          href="/about"
          rel="author"
          itemProp="author"
          itemScope
          itemType="https://schema.org/Person"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          data-testid={`${testId}-author`}
        >
          <span itemProp="name" data-testid={`${testId}-author-name`}>
            {authorProfile.name}
          </span>
        </Link>
        {showCredentials ? (
          <span className="ml-1">
            · {authorProfile.role} · {authorProfile.credential}
          </span>
        ) : (
          <span className="sr-only">, {authorProfile.role}, {authorProfile.credential}</span>
        )}
      </span>
      <span aria-hidden="true">·</span>
      <span>
        Reviewed by{" "}
        <span className="font-medium text-foreground" data-testid={`${testId}-reviewer`}>
          {BLOG_REVIEWER_PROFILE.name}
        </span>
      </span>
    </div>
  );
}