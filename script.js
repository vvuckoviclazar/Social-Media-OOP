"use strict";

const friendsList = document.querySelector(".friends-list");
const searchInput = document.querySelector(".find-friends");
const suggestionsBox = document.querySelector(".search-suggestions");
const postInput = document.querySelector(".write-post");
const postList = document.querySelector(".post-list");
const newPostForm = document.querySelector(".write-form");

const userAccount = {
  owner: "Dario Jularic",
  place: "Zagreb, Croatia",
  picture: "avatar-image2.jpg",
};

const account = userAccount;

class Post {
  constructor(author, text) {
    this.author = author;
    this.text = text;
    this.likes = [];
    this.comments = [];
    this.isLiked = false;
  }

  toggleLike(user) {
    if (!this.isLiked) {
      this.likes.push(user);
      this.isLiked = true;
    } else {
      this.likes = this.likes.filter((u) => u !== user);
      this.isLiked = false;
    }
  }

  addComment(text) {
    this.comments.push({ user: currentUser, text });
  }
}

class User {
  constructor(name = "", picture = "", place = "") {
    this.name = name;
    this.picture = picture;
    this.place = place;
    this.myFriends = [];
    this.posts = [];
  }

  getName() {
    return this.name;
  }

  getPicture() {
    return this.picture;
  }

  addFriend(friend) {
    this.myFriends.push(friend);
  }

  renderFriend(friend) {
    const friendCard = document.createElement("div");
    friendCard.classList.add("friend-card");

    friendCard.innerHTML = `
      <img src="${friend.getPicture()}" alt="${friend.getName()}" class="friend-img" />
      <p class="friend-name">${friend.getName()}</p>
    `;

    friendsList.appendChild(friendCard);
  }

  renderAllFriends() {
    friendsList.innerHTML = "";
    this.myFriends.forEach((friend) => this.renderFriend(friend));
  }

  searchFriends(query) {
    return this.myFriends.filter((friend) =>
      friend.getName().toLowerCase().startsWith(query.toLowerCase())
    );
  }

  displayUserInfo() {
    const nameDiv = document.querySelector(".name-div h1");
    const placePara = document.querySelector(".name-div p");
    const profileImg = document.querySelector(".img2");

    nameDiv.textContent = this.name;
    placePara.textContent = this.place;
    profileImg.src = this.picture;
  }

  addPost(text) {
    const post = new Post(this, text);
    this.posts.push(post);
    return post;
  }
}

function renderPost(post, index) {
  const li = document.createElement("li");
  li.dataset.postId = index;

  li.innerHTML = `
    <div class="userName-div">
      <img class="post-img" src="${post.author.picture}" />
      <h1 class="post-h1">${post.author.name}</h1>
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

const friends = [
  { name: "Emily Johnson", picture: "profile1.jpg" },
  { name: "Jason Smith", picture: "profile2.jpg" },
  { name: "Stephan Williams", picture: "profile3.jpg" },
  { name: "James Brown", picture: "profile4.jpg" },
  { name: "Oliveira Jones", picture: "profile5.jpg" },
  { name: "Daniel Miller", picture: "profile6.jpg" },
];

friends.forEach((data) => {
  const newFriend = new User(data.name, data.picture);
  currentUser.addFriend(newFriend);
});
currentUser.renderAllFriends();

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
    if (post.isLiked) {
      likeBtn.classList.add("liked");
      likedText.textContent = `${currentUser.name} liked this post.`;
    } else {
      likeBtn.classList.remove("liked");
      likedText.textContent = "";
    }
  }

  if (e.target.closest(".add-comment-btn")) {
    const input = li.querySelector(".comment-input");
    const text = input.value.trim();
    if (text === "") return;
    post.addComment(text);
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
