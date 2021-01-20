import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Repo } from '../typings/Repo';

let loading = false;

function RepoDisplay() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getRepos = async () => {
    // Prevent multiple requests from happening at the same time
    // Also prevent repos from being retrieved if they already exist (clear them out first)
    if (loading || repos) {
      return;
    }
    loading = true;

    // eslint-disable-next-line no-console
    console.debug('getRepos called');
    setRepos(null);
    setError(null);

    try {
      const repoRequest = await axios.get<Repo[]>(
        'http://localhost:4000/repos'
      );
      setRepos(repoRequest.data);
    } catch (e) {
      setError(e);
    } finally {
      loading = false;
    }
  };

  useEffect(() => {
    // Only initiate loading if there is no data to display
    if (!repos && !error && !loading) {
      getRepos();
    }
  });

  if (error) {
    return <>Error: {error}</>;
  } else if (repos) {
    return <>There are {repos.length} repos in the request</>;
  } else {
    return <>Loading</>;
  }
}

// const RepoDisplay: React.FC = () => {
//   return <>Hello World</>;
// };

export { RepoDisplay };
