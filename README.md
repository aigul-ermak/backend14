# Blogger Platform - Sprint 3, Week 4

## Overview

This sprint focuses on implementing the functionality to display likes and dislikes on posts within the Blogger Platform. Authenticated users will have the ability to like or dislike posts. This enhancement involves both frontend and backend development to ensure a seamless user experience.

## User Story: UC-1. Displaying Likes/Dislikes on Posts

### Frontend Implementation

**Functionalities to Implement:**

1. **Displaying Likes/Dislikes for Posts:**
   - Authenticated users can see the number of likes (thumbs up) and dislikes (thumbs down) on each post.
   - Authenticated users can like or dislike a post.

2. **Displaying the Last Three Users Who Liked a Post:**
   - The system displays the usernames of the last three users who liked the post.

**Design:**
- Sprint: 3
- Project: Blogger Platform

### Backend Implementation

**Endpoint Creation:**
- **PUT** - `api/posts/{postId}/like-status`
   - This endpoint handles the functionality to update the like or dislike status for a specific post.
   - Refer to the Swagger API documentation (h12 API) for detailed information.

### Use Case: UC-1. Displaying Likes/Dislikes on Posts

**Description:**
As an authenticated user, I want to like or dislike a post to express my emotions.

**Scenario:**

**Main Scenario:**
1. The authenticated user is on the page of a selected post.
2. The authenticated user can see the number of likes (thumbs up) and dislikes (thumbs down) on the post.
3. The system displays the usernames of the last three users who liked the post.
4. The authenticated user likes the post.
5. The system updates the number of likes, the display of the last three usernames, and highlights the "Like" attribute.
   - The user sees their like, which they placed on the post (the attribute is highlighted).

**Alternative Scenario:**
1. Steps 1-2 of the main scenario.
2. The authenticated user dislikes the post.
3. The system updates the number of dislikes and highlights the "Dislike" attribute.
   - The user sees their dislike, which they placed on the post (the attribute is highlighted).

**Notes:**
- Ensure that only authenticated users can like or dislike posts.
- The UI should clearly indicate which posts have been liked or disliked by the user.
- The backend should handle the like/dislike logic and update the post status accordingly.
- Refer to the Swagger API documentation for detailed endpoint usage and parameters.
- For this migration step, you shouldn't migrate the following functionalities:
  - Entire auth flow (including devices), basic auth, and bearer auth.
  - Validation.
  - Create/update/delete for comments (because these operations require bearer auth), but read requests should work for comments already in the DB.
  - Create/update/delete for likes for comments and for posts (because these operations require bearer auth). But read requests should work for likes already in the DB when we read posts and comments.
