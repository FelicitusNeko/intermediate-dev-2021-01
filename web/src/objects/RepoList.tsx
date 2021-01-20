//import React from 'react';
import { ChangeEvent, useState } from 'react';
import { Repo } from '../typings/Repo';
import { RepoItem } from './RepoItem';

interface RepoListProps {
  repos: Repo[];
}
function RepoList({ repos }: RepoListProps) {
  const [langFilter, useLangFilter] = useState<string[]>([]);

  function OnFilterChange({ currentTarget }: ChangeEvent<HTMLSelectElement>) {
    useLangFilter(
      [...currentTarget.selectedOptions].map(
        (item: HTMLOptionElement) => item.value
      )
    );
  }

  const languageList = [...new Set(repos.map((repo: Repo) => repo.language))];

  let filterRepos = repos;
  if (langFilter.length > 0) {
    filterRepos = filterRepos.filter((repo: Repo) =>
      langFilter.includes(repo.language)
    );
  }

  return (
    <>
      <p>There are {repos.length} repos in the request</p>
      <p>Filter:</p>
      <select multiple={true} onChange={OnFilterChange}>
        {languageList.map((item: string) => (
          <option key={`filtervalue-${item}`} value={item}>
            {item}
          </option>
        ))}
      </select>

      <ul>
        {filterRepos.map((item, index) => (
          <RepoItem key={`repo-${index}`} repo={item} index={index} />
        ))}
      </ul>
    </>
  );
}

export { RepoList };
