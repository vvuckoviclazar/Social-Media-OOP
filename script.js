"use strict";

const friendsList = document.querySelector(".friends-list");
const searchInput = document.querySelector(".find-friends");
const suggestionsBox = document.querySelector(".search-suggestions");
const postInput = document.querySelector(".write-post");
const postList = document.querySelector(".post-list");
const newPostForm = document.querySelector(".write-form");

const friends = [
  { name: "Emily Johnson", picture: "profile1.jpg" },
  { name: "Jason Smith", picture: "profile2.jpg" },
  { name: "Stephan Williams", picture: "profile3.jpg" },
  { name: "James Brown", picture: "profile4.jpg" },
  { name: "Oliveira Jones", picture: "profile5.jpg" },
  { name: "Daniel Miller", picture: "profile6.jpg" },
];

const userAccount = [
  {
    owner: "Dario Jularic",
    place: "Zagreb, Croatia",
    picture: "avatar-image2.jpg",
  },
];

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
}

class Like {}

class Comment {}

const account = userAccount[0];
const currentUser = new User(account.owner, account.picture, account.place);

currentUser.displayUserInfo();

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

// neka oko inputa za dodavanje posta bude forma a ovde neka bude submit
newPostForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const postText = postInput.value.trim();

  if (postText === "") return;

  currentUser.posts.push(postText);

  const li = document.createElement("li");

  //imas klasu user to je glavna klasa tj instanca te klase (currentUser) sadrzava sve ostalo
  //razmisli:
  //kad dodam novi post sta se desi? koja polja treba da ima svaki post?
  //u kojem arrayu treba da zive ti postovi? tj ko upravlja postovima
  //dobro i detaljno pogledaj od cega se sadrze postovi
  //koje informacije sacinjavaju post
  li.innerHTML = `
    <div class="userName-div">
      <img class="post-img" src="${currentUser.picture}" />
      <h1 class="post-h1">${currentUser.name}</h1>
    </div>
    <h2 class="post-text">${postText}</h2>
    <div class="post-buttons-div">
      <button class="like">Like</button>
      <button class="comment">Comment</button>
    </div>
    <div class="comment-section">
      <img class="post-img" src="${currentUser.picture}" />
      <input type="text" class="comment-input" placeholder="Write a comment" />
      <button class="add-comment-btn">Add comment</button> 
    </div>
  `;

  postList.prepend(li);
  postInput.value = "";
});
