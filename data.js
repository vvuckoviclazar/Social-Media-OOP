"use strict";

export const userAccount = {
  owner: "Dario Jularic",
  place: "Zagreb, Croatia",
  picture: "avatar-image2.jpg",
};

export const friends = [
  { name: "Emily Johnson", picture: "profile1.jpg" },
  { name: "Jason Smith", picture: "profile2.jpg" },
  { name: "Stephan Williams", picture: "profile3.jpg" },
  { name: "James Brown", picture: "profile4.jpg" },
  { name: "Oliveira Jones", picture: "profile5.jpg" },
  { name: "Daniel Miller", picture: "profile6.jpg" },
];

export const fixedPosts = [
  {
    text: "This platform is all about thoughtful reflections.",
    likes: [{ name: "James Brown", image: "profile4.jpg" }],
    comments: [
      {
        profile: "James Brown",
        text: "Makes me ponder on the importance of staying true to one's moral compass.",
        image: "profile4.jpg",
      },
      {
        profile: "Oliveira Jones",
        text: "Sometimes the best option is to stick to your principles.",
        image: "profile5.jpg",
      },
    ],
  },
  {
    text: "The world doesn't need more noise. It needs more meaning.",
    likes: [{ name: "Daniel Miller", image: "profile6.jpg" }],
    comments: [
      {
        profile: "Daniel Miller",
        text: "Couldn't agree more.",
        image: "profile6.jpg",
      },
    ],
  },
];
