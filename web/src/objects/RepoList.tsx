//import React from 'react';
import { Repo } from '../typings/Repo';

interface RepoListProps {
  repos: Repo[];
}
function RepoList({ repos }: RepoListProps) {
  return (
    <>
      There are {repos.length} repos in the request
      <br />
      Here is where they will show up
    </>
  );
}

export { RepoList };
