/* eslint-disable @typescript-eslint/naming-convention */
export interface CommitVerification {
  verified: boolean;
  reason: string;
  signature: string | null;
  payload: string | null;
}

export interface CommitData {
  author: CommitPerson;
  committer: CommitPerson;
  message: string;
  tree: {
    sha: string;
    url: string;
  };
  url: string;
  comment_count: number;
  verification: CommitVerification;
}

export interface CommitPerson {
  name: string;
  email: string;
  date: string;
}

export interface CommitPersonDetails {
  login: string;
  id: number;
  avatar_id: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface ParentUrls {
  sha: string;
  url: string;
  html_url: string;
}

export interface Commit {
  sha: string;
  node_id: string;
  commit: CommitData;
  url: string;
  html_url: string;
  comments_url: string;
  author: CommitPersonDetails;
  committer: CommitPersonDetails;
  parents: ParentUrls[];
}
