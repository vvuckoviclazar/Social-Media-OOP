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

function renderPost(post, index) {
  const li = document.createElement("li");
  li.dataset.postId = index;
  li.innerHTML = `
    <div class="userName-div">
     <div class="left-mini-div">
       <img class="post-img" src="${post.author.picture}" />
       <h1 class="post-h1">${post.author.name}</h1>
      </div>
      <div class="right-mini-div">
      <button class="edit-post-btn">edit</button>
      <button class="delete-post-btn">delete</button>
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
    post.comments.push(new Comment(commenter, c.text));
  });

  currentUser.posts.push(post);
  const li = renderPost(post, currentUser.posts.length - 1);

  const likedText = li.querySelector(".liked-by-text");
  const likeBtn = li.querySelector(".like-btn");

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
  post.comments.forEach((comment) => {
    const newComment = document.createElement("li");
    newComment.classList.add("single-comment");
    newComment.innerHTML = `
      <div class="comment-user">
        <img class="post-img" src="${comment.user.picture}" />
        <div class="comment-style">
          <span class="comment-name">${comment.user.name}</span>
          <span class="comment-text">${comment.text}</span>
        </div>
      </div>
    `;
    commentList.appendChild(newComment);
  });

  commentCount.textContent = `${post.comments.length} comment${
    post.comments.length === 1 ? "" : "s"
  }`;

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
  postList.prepend(li);
  postInput.value = "";
});

postList.addEventListener("click", function (e) {
  const li = e.target.closest("li");
  if (!li) return;
  const id = Number(li.dataset.postId);
  const post = currentUser.posts[id];

  if (e.target.closest(".like-btn")) {
    post.toggleLike(currentUser);
    const likeBtn = li.querySelector(".like-btn");
    const likedText = li.querySelector(".liked-by-text");

    if (post.isLikedBy(currentUser)) {
      likeBtn.classList.add("liked");
    } else {
      likeBtn.classList.remove("liked");
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
    } else {
      likedText.textContent = "";
    }
  }

  if (e.target.closest(".add-comment-btn")) {
    const input = li.querySelector(".comment-input");
    const text = input.value.trim();
    if (text === "") return;

    post.addComment(currentUser, text);
    input.value = "";

    const commentList = li.querySelector(".comment-list");
    const newComment = document.createElement("li");
    newComment.classList.add("single-comment");
    newComment.innerHTML = `
      <div class="comment-user">
        <img class="post-img" src="${currentUser.picture}" />
        <div class="comment-style">
          <span class="comment-name">${currentUser.name}</span>
          <span class="comment-text">${text}</span>
        </div>
      </div>
    `;
    commentList.appendChild(newComment);

    const commentCount = li.querySelector(".comment-count");
    const count = post.comments.length;
    commentCount.textContent = `${count} comment${count === 1 ? "" : "s"}`;
  }
});
