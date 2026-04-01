/**
 * Date created : 16/04/2024
 *
 * Author : Nothile Moyo
 *
 * Description: This is where we define important types for key features
 * Types for global state are defined here too
 */

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.html" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

export interface Post {
  _id: string;
  content: string;
  fileName: string;
  fileLastUpdated: string;
  imageUrl: string;
  title: string;
  creator: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  status: string;
  posts: string[];
}

export interface FileData {
  fileName: string;
  imageUrl: string;
}

export interface FileRequestData {
  fileName: string;
  fileLastUpdated: string;
  imageUrl: string;
  isFileValid: boolean;
  isFileSizeValid: boolean;
  isFileTypeValid: boolean;
  isImageUrlValid: boolean;
}

export interface Message {
  _id: string;
  message: string;
  dateSent: string;
  senderId: string;
  sender: string;
}

export interface Messages {
  _id: string;
  userIds: string[];
  messages: Message[];
}

export type ButtonType = "button" | "submit" | "reset" | undefined;
