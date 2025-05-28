"use strict";

const friendsList = document.querySelector(".friends-list");
const searchInput = document.querySelector(".find-friends");
const suggestionsBox = document.querySelector(".search-suggestions");
const postInput = document.querySelector(".write-post");
const postList = document.querySelector(".post-list");
const newPostForm = document.querySelector(".write-form");

import { userAccount, friends, fixedPosts } from "./data.js";
import { Like, Comment, Post, User } from "./classes.js";

const account = userAccount;

function setupRenderedPost(post, li) {
  const likeBtn = li.querySelector(".like-btn");
  const likedText = li.querySelector(".liked-by-text");

  if (post.isLikedBy(currentUser)) {
    likeBtn.classList.add("liked");
  }

  if (post.likes.length > 0) {
    if (post.isLikedBy(currentUser)) {
      const others = post.likes.filter((like) => like.user !== currentUser);
      likedText.textContent =
        others.length > 0
          ? `${currentUser.name} and ${others[0].user.name} liked this post.`
          : `${currentUser.name} liked this post.`;
    } else {
      likedText.textContent = `${post.likes[0].user.name} liked this post.`;
    }
  }

  const commentList = li.querySelector(".comment-list");
  const commentCount = li.querySelector(".comment-count");

  post.comments.forEach((comment, index) => {
    const newComment = document.createElement("li");
    newComment.classList.add("single-comment");
    newComment.dataset.commentId = index;
    newComment.innerHTML = `
      <div class="comment-user">
        <img class="post-img" src="${comment.user.picture}" />
         <div class="comment-style">
          <span class="comment-name">${comment.user.name}</span>
          <span class="comment-text">${comment.text}</span>
        <div class="like-delete-comment">
            <div class="like-com-div">
            <button class="like-comment">I like it.</button>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
</svg>
<span class="likes-number">${comment.commentLikes.length}</span>
          </div>
            <button class="delete-comment">Delete comment.</button>
          </div>
        </div>
      </div>
    `;

    commentList.appendChild(newComment);
  });

  commentCount.textContent = `${post.comments.length} comment${
    post.comments.length === 1 ? "" : "s"
  }`;
}

function renderPost(post, index) {
  const li = document.createElement("li");
  li.dataset.postId = index;
  li.innerHTML = `
    <div class="userName-div">
     <div class="left-mini-div">
       <img class="post-img" src="${post.author.picture}" />
       <h1 class="post-h1">${post.author.name}</h1>
      </div>
      <div class="open-div">
       <button class="dot-btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
         <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
         </svg>
       </button>
        <div class="right-mini-div">
         <button class="edit-post-btn">edit</button>
         <button class="delete-post-btn">delete</button>
        </div>
      </div>
      
      
    </div>
    <h2 class="post-text">${post.text}</h2>
    <div class="like-comment-div">
      <p class="liked-by-text"></p>
      <p class="comment-count">0 comments</p>
    </div>
    <div class="post-buttons-div">
      <button class="like like-btn">Like</button>
      <button class="comment comment-btn">Comment</button>
    </div>
    <div class="comment-section">
      <img class="post-img" src="${post.author.picture}" />
      <input type="text" class="comment-input" placeholder="Write a comment" />
      <button class="add-comment-btn">Add comment</button>
    </div>
    
    <ul class="comment-list"></ul>
  `;
  return li;
}

const currentUser = new User(account.owner, account.picture, account.place);
currentUser.displayUserInfo();

friends.forEach((data) => {
  const newFriend = new User(data.name, data.picture);
  currentUser.addFriend(newFriend);
});
currentUser.renderAllFriends(friendsList);

fixedPosts.forEach((data) => {
  const post = new Post(currentUser, data.text);

  if (data.likes) {
    data.likes.forEach((l) => {
      const liker = new User(l.name, l.image, "");
      post.likes.push(new Like(liker));
    });
  }

  data.comments.forEach((c) => {
    const commenter = new User(c.profile, c.image, "");
    const comment = new Comment(commenter, c.text);

    const fakeLiker1 = new User("Test User 1", "test1.png");
    const fakeLiker2 = new User("Test User 2", "test2.png");

    comment.commentLikes.push(new Like(fakeLiker1), new Like(fakeLiker2));

    if (c.likes) {
      c.likes.forEach((l) => {
        const liker = new User(l.name, l.image, "");
        comment.commentLikes.push(new Like(liker));
      });
    }

    post.comments.push(comment);
  });

  currentUser.posts.push(post);
  const li = renderPost(post, currentUser.posts.length - 1);

  setupRenderedPost(post, li);

  postList.appendChild(li);
});

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  const matches = currentUser.searchFriends(query);
  suggestionsBox.innerHTML = "";
  if (query !== "" && matches.length > 0) {
    matches.forEach((friend) => {
      const item = document.createElement("div");
      item.classList.add("suggestion-item");
      item.innerHTML = `
        <img src="${friend.getPicture()}" class="suggestion-img" />
        <span class="suggestion-name">${friend.getName()}</span>
      `;
      suggestionsBox.appendChild(item);
    });
    suggestionsBox.hidden = false;
  } else {
    suggestionsBox.hidden = true;
  }
});

newPostForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const postText = postInput.value.trim();
  if (postText === "") return;

  const newPost = currentUser.addPost(postText);
  const li = renderPost(newPost, currentUser.posts.length - 1);
  setupRenderedPost(newPost, li);
  postList.prepend(li);

  postInput.value = "";
});

postList.addEventListener("click", function (e) {
  const li = e.target.closest("li[data-post-id]");
  if (!li) return;
  const id = Number(li.dataset.postId);
  const post = currentUser.posts[id];
  if (!post) return;

  if (e.target.closest(".like-btn")) {
    post.toggleLike(currentUser);
    const likeBtn = li.querySelector(".like-btn");
    const likedText = li.querySelector(".liked-by-text");

    likeBtn.classList.toggle("liked", post.isLikedBy(currentUser));

    if (post.likes.length > 0) {
      if (post.isLikedBy(currentUser)) {
        const others = post.likes.filter((like) => like.user !== currentUser);
        likedText.textContent =
          others.length > 0
            ? `${currentUser.name} and ${others[0].user.name} liked this post.`
            : `${currentUser.name} liked this post.`;
      } else {
        likedText.textContent = `${post.likes[0].user.name} liked this post.`;
      }
    } else {
      likedText.textContent = "";
    }
  }

  if (e.target.closest(".add-comment-btn")) {
    const input = li.querySelector(".comment-input");
    const text = input.value.trim();
    if (text === "") return;

    const comment = new Comment(currentUser, text);
    post.comments.push(comment);
    input.value = "";

    const commentList = li.querySelector(".comment-list");
    const commentIndex = post.comments.length - 1;

    const newComment = document.createElement("li");
    newComment.classList.add("single-comment");
    newComment.dataset.commentId = commentIndex;
    newComment.innerHTML = `
      <div class="comment-user">
        <img class="post-img" src="${currentUser.picture}" />
        <div class="comment-style">
        <button class="edit-com-btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>
</button>
          <span class="comment-name">${currentUser.name}</span>
          <span class="comment-text">${text}</span>
          <div class="like-delete-comment">
          <div class="like-com-div">
            <button class="like-comment">I like it.</button>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
</svg>
<span class="likes-number">${comment.commentLikes.length}</span>
          </div>
            <button class="delete-comment">Delete comment.</button>
          </div>
        </div>
      </div>
    `;
    commentList.appendChild(newComment);

    const commentCount = li.querySelector(".comment-count");
    commentCount.textContent = `${post.comments.length} comment${
      post.comments.length === 1 ? "" : "s"
    }`;
  }

  if (e.target.closest(".edit-post-btn")) {
    post.toggleEditMode();
    const postTextEl = li.querySelector(".post-text");
    const input = document.createElement("input");
    input.type = "text";
    input.value = post.text;
    input.className = "edit-input";
    postTextEl.replaceWith(input);

    const editBtn = e.target.closest(".edit-post-btn");
    editBtn.textContent = "finish";
    editBtn.classList.replace("edit-post-btn", "finish-edit-btn");
    return;
  }

  if (e.target.closest(".finish-edit-btn")) {
    post.toggleEditMode();
    const input = li.querySelector(".edit-input");
    const newText = input.value.trim();
    if (newText !== "") post.text = newText;

    const newPostText = document.createElement("h2");
    newPostText.className = "post-text";
    newPostText.textContent = post.text;
    input.replaceWith(newPostText);

    const finishBtn = e.target.closest(".finish-edit-btn");
    finishBtn.textContent = "Edit";
    finishBtn.classList.replace("finish-edit-btn", "edit-post-btn");
    return;
  }

  if (e.target.closest(".delete-post-btn")) {
    currentUser.posts.splice(id, 1);
    li.remove();
    postList.querySelectorAll("li").forEach((li, i) => {
      li.dataset.postId = i;
    });
    return;
  }

  if (e.target.closest(".dot-btn")) {
    const menu = li.querySelector(".right-mini-div");
    menu?.classList.toggle("show");
    return;
  }

  if (e.target.classList.contains("like-comment")) {
    const commentLi = e.target.closest(".single-comment");
    if (!commentLi) return;

    const commentIndex = Number(commentLi.dataset.commentId);
    const comment = post.comments[commentIndex];
    if (!comment) return;

    const likeBtn = commentLi.querySelector(".like-comment");
    const likesNumber = commentLi.querySelector(".likes-number");

    comment.toggleLike(currentUser);

    if (comment.isLikedBy(currentUser)) {
      likeBtn.classList.add("liked-comment");
      likeBtn.style.color = "rgb(0, 136, 255);";
    } else {
      likeBtn.classList.remove("liked-comment");
      likeBtn.style.color = "";
    }

    const svgIcon = commentLi.querySelector(".like-com-div svg");
    if (svgIcon)
      svgIcon.style.stroke = comment.isLikedBy(currentUser) ? "blue" : "";

    likesNumber.textContent = comment.commentLikes.length;
  }

  if (e.target.classList.contains("delete-comment")) {
    const commentLi = e.target.closest(".single-comment");
    if (!commentLi) return;
    const commentIndex = Number(commentLi.dataset.commentId);
    if (isNaN(commentIndex)) return;

    post.comments.splice(commentIndex, 1);
    commentLi.remove();

    const allComments = li.querySelectorAll("li.single-comment");
    allComments.forEach((commentEl, i) => {
      commentEl.dataset.commentId = i;
    });

    const commentCount = li.querySelector(".comment-count");
    commentCount.textContent = `${post.comments.length} comment${
      post.comments.length === 1 ? "" : "s"
    }`;
  }

  if (e.target.closest(".edit-com-btn")) {
    const editBtn = e.target.closest(".edit-com-btn");
    const commentLi = editBtn.closest(".single-comment");
    if (!commentLi) return;

    const commentIndex = Number(commentLi.dataset.commentId);
    const comment = post.comments[commentIndex];
    if (!comment) return;

    if (comment.user !== currentUser) return;

    const existingInput = commentLi.querySelector(".edit-comment-input");

    if (existingInput) {
      const newText = existingInput.value.trim();
      if (newText !== "") {
        comment.text = newText;
      }

      const newSpan = document.createElement("span");
      newSpan.className = "comment-text";
      newSpan.textContent = comment.text;

      existingInput.replaceWith(newSpan);
      editBtn.classList.remove("editing");
    } else {
      const commentTextSpan = commentLi.querySelector(".comment-text");
      if (!commentTextSpan) return;

      const input = document.createElement("input");
      input.type = "text";
      input.value = comment.text;
      input.className = "edit-comment-input";

      commentTextSpan.replaceWith(input);
      editBtn.classList.add("editing");
    }
  }
});
