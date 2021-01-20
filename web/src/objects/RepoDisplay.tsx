import axios, { AxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import { Repo } from '../typings/Repo';

function RepoDisplay() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getRepos = async () => {
    // Prevent multiple requests from happening at the same time
    // Also prevent repos from being retrieved if they already exist (clear them out first)
    if (loading || repos || error) {
      return;
    }

    // Indicate that we're loading data, so getRepos doesn't get called again until we're done
    setLoading(true);

    try {
      // Retrieve data from API
      const repoRequest = await axios.get<Repo[]>(
        'http://localhost:4000/repos'
      );

      // Create a shallow copy of the response data
      const repoResponse = repoRequest.data.slice();

      // Sort the response data based on creation date (latest first)
      repoResponse.sort((a: Repo, b: Repo) => {
        const aDate = new Date(a.created_at);
        const bDate = new Date(b.created_at);

        if (aDate > bDate) {
          return -1;
        } else if (aDate < bDate) {
          return 1;
        } else {
          return 0;
        }
      });

      // Store it for use
      setRepos(repoResponse);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        // If the error is with Axios, get error information from it
        const eAxios = e as AxiosError;
        setError(
          eAxios.response
            ? `${eAxios.response.status} ${eAxios.response.statusText} (${eAxios.message})`
            : eAxios.message
        );
      } else {
        // If not, get generic information from error
        setError((e as Error).message);
      }
      // Oops, something bad happened
    } finally {
      // Pass or fail, we can call getRepos again
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only initiate loading if there is no data to display
    if (!repos && !error && !loading) {
      getRepos();
    }
  });

  const onResetClick = () => {
    setRepos(null);
    setError(null);
  };

  if (error) {
    return (
      <>
        Error: {error}
        <br />
        <button onClick={onResetClick}>Try again</button>
      </>
    );
  } else if (repos) {
    return (
      <>
        There are {repos.length} repos in the request
        <br />
        <button onClick={onResetClick}>Reload data</button>
      </>
    );
  } else {
    return <>Loading</>;
  }
}

// const RepoDisplay: React.FC = () => {
//   return <>Hello World</>;
// };

export { RepoDisplay };
