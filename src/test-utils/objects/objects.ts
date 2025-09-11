import { User } from "../../@types";
import { ContextProps } from "../../context/AppContext";
import { Post } from "../../@types";

// Define a user here which should have their details rendered on the main App page
export const mockUser: User = {
  _id: "6624158268f8cf47bea31396",
  name: "Nothile Moyo",
  email: "nothile1@gmail.com",
  password: "test",
  status: "active",
  posts: [
    "662423764e8c8b1633534be8",
    "662423884e8c8b1633534bf0",
    "662e7bcdd94fde36bf4bb554",
    "662e7c6ad94fde36bf4bb55c",
    "67843561d02db477bac4843b",
  ],
};

export const mockContext: ContextProps = {
  baseUrl: process.env.API_URL_DEV ?? "http://localhost:4000",
  checkAuthentication: () => true,
  logoutUser: () => {},
  token: "fake-token",
  userId: "12345-nothile-id",
  userAuthenticated: true,
  validateAuthentication: () => {},
};

// Mocking our posts
export const mockPosts: Post[] = [
  {
    _id: "662423764e8c8b1633534be8",
    fileLastUpdated: "",
    fileName: "2B.png",
    title: "2B",
    imageUrl: "..\frontend\x02src\x02images\x022B.png",
    content:
      "YoRHa No. 2 Type B,[a] commonly known as 2B,[b] is a fictional android from the 2017 video game Nier: Automata, a spin-off of the Drakengard series developed by PlatinumGames and published by Square Enix. One of the game's three protagonists, 2B is a soldier for YoRHa, an android task force fighting a proxy war with alien-created Machine Lifeforms. Her story arc focuses on her backstory within YoRHa, and her relationship with her partner 9S, a reconnaissance android. She is also featured in related media, such as the anime Nier: Automata Ver1.1a.",
    creator: "12345-nothile-id",
    createdAt: "1713644407010",
    updatedAt: "1713644407010",
  },
  {
    _id: "662423884e8c8b1633534bf0",
    fileLastUpdated: "",
    fileName: "Alfira-face.jpg",
    title: "Alfira",
    imageUrl: "..\x02frontend\x02src\x02images\x02Alfira-face.jpg",
    content:
      "Alfira is part of the group of tiefling refugees who were exiled from Elturel, and Bardic apprentice to a woman named Lihala. On the journey to the Emerald Grove, they were attacked by gnolls, and Lihala was killed. Alfira has since been trying to compose a eulogy for her.",
    creator: "12345-nothile-id",
    createdAt: "1713644424070",
    updatedAt: "1713644424070",
  },
  {
    _id: "662e7bcdd94fde36bf4bb554",
    fileLastUpdated: "",
    fileName: "Shanalotte.jpg",
    title: "Emerald Herald",
    imageUrl: "..\x02frontend\x02src\x02images\x02Shanalotte.jpg",
    content:
      "The Emerald Herald is first encountered in the town of Majula, where she sits beside the cliff overlooking the ocean. Her true nature and purpose are shrouded in mystery, but she plays a crucial role in the player's quest by providing them with the means to level up and upgrade their Estus Flask.",
    creator: "12345-nothile-id",
    createdAt: "1714322381968",
    updatedAt: "1714322381968",
  },
  {
    _id: "662e7c6ad94fde36bf4bb55c",
    fileLastUpdated: "",
    fileName: "Tiefling.jpg",
    title: "Tieflings",
    imageUrl: "..\x02frontend\x02src\x02images\x02Tiefling.jpg",
    content:
      "But you do see the way people look at you, devil’s child? Those black eyes, cold as a winter storm, were staring right into her heart and the sudden seriousness in his voice jolted her.",
    creator: "12345-nothile-id",
    createdAt: "1714322538849",
    updatedAt: "1741993615409",
  },
  {
    _id: "67843561d02db477bac4843b",
    fileLastUpdated: "",
    fileName: "Edelgard.jpg",
    title: "The Sixth Post",
    imageUrl: "../frontend/src/images/Edelgard.jpg",
    content: "Descriptions are a useful thing when you have them!",
    creator: "12345-nothile-id",
    createdAt: "1736717665449",
    updatedAt: "1756408330943",
  },
  {
    _id: "68b0aac75d6f6df6ef698e7e",
    fileLastUpdated: "",
    fileName: "Shanalotte.jpg",
    title: "Testing post number 6",
    imageUrl: "../frontend/src/images/Shanalotte.jpg",
    content: "Testing post number 6 for functionality",
    creator: "12345-nothile-id",
    createdAt: "1756408519264",
    updatedAt: "1756495750074",
  },
];
