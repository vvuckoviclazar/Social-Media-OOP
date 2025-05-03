"use strict";

const friendsList = document.querySelector(".friends-list");
const searchInput = document.querySelector(".find-friends");
const suggestionsBox = document.querySelector(".search-suggestions");

const friends = [
  { name: "Emily Johnson", picture: "profile1.jpg" },
  { name: "Jason Smith", picture: "profile2.jpg" },
  { name: "Stephan Williams", picture: "profile3.jpg" },
  { name: "James Brown", picture: "profile4.jpg" },
  { name: "Oliveira Jones", picture: "profile5.jpg" },
  { name: "Daniel Miller", picture: "profile6.jpg" },
];

class Friend {
  constructor(name, picture) {
    this.name = name;
    this.picture = picture;
  }

  getName() {
    return this.name;
  }

  getPicture() {
    return this.picture;
  }
}

class FriendsManager {
  constructor() {
    this.myFriends = [];
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
}

const manager = new FriendsManager();

friends.forEach((data) => {
  const newFriend = new Friend(data.name, data.picture);
  manager.addFriend(newFriend);
});

manager.renderAllFriends();

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  const matches = manager.searchFriends(query);

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

// NAPRAVI USER KLASU
// MAKNI FRIENDSMANAGER KLASU
// NAPRAVI DA SE MOZE DODATI POST
