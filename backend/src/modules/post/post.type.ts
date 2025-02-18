import { User } from "../user/user.type";

export type Category = {
  id: string;
  name: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PostVote = {
  postId: string;
  userId: string;
  voteType: VoteType;
};

export type PostWithCategoriesAndVotes = Post & {
  categories: string[];
  user: User;
  voteCounts: {
    upvotes: number;
    downvotes: number;
  };
};

export type PostQueryResult = Post & {
  user: User;
  postsToCategories: {
    category: {
      name: string;
    };
  }[];
  votes: {
    voteType: number | null;
  }[];
};

export enum VoteType {
  UPVOTE = 1,
  DOWNVOTE = -1,
}