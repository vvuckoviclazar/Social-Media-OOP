export class Like {
  constructor(user) {
    this.user = user;
  }
}

export class Comment {
  constructor(user, text) {
    this.user = user;
    this.text = text;
  }
}

export class Post {
  constructor(author, text) {
    this.author = author;
    this.text = text;
    this.likes = [];
    this.comments = [];
  }

  toggleLike(user) {
    const existing = this.likes.find((like) => like.user === user);
    if (existing) {
      this.likes = this.likes.filter((like) => like.user !== user);
    } else {
      this.likes.push(new Like(user));
    }
  }

  isLikedBy(user) {
    return this.likes.some((like) => like.user === user);
  }

  addComment(user, text) {
    this.comments.push(new Comment(user, text));
  }
}

export class User {
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

  renderFriend(friend, container) {
    const friendCard = document.createElement("div");
    friendCard.classList.add("friend-card");

    friendCard.innerHTML = `
      <img src="${friend.getPicture()}" alt="${friend.getName()}" class="friend-img" />
      <p class="friend-name">${friend.getName()}</p>
    `;

    container.appendChild(friendCard);
  }

  renderAllFriends(container) {
    container.innerHTML = "";
    this.myFriends.forEach((friend) => this.renderFriend(friend, container));
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
