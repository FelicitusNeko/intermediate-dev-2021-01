import axios from 'axios';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useParams } from 'react-router-dom';
import { Commit } from '../typings/Commit';
import { Repo } from '../typings/Repo';

interface RepoDetailsProps {
  repos: Repo[];
}
function RepoDetails({ repos }: RepoDetailsProps) {
  const [repo, setRepo] = useState<Repo | null>(null);
  const [commit, setCommit] = useState<Commit | string | null>(null);
  const [readme, setReadme] = useState<string | null>(null);
  const [loadingCommit, setLoadingCommit] = useState(false);
  const [loadingReadme, setLoadingReadme] = useState(false);
  const { index } = useParams<{ index: string }>();
  const indexNum = parseInt(index, 10);

  // If repos are not loaded, wait for them to load from the parent
  if (!repos) {
    return <>Loading repos...</>;
  }

  async function loadCommit() {
    // Make sure we are not submitting concurrent requests
    if (!repo || loadingCommit) {
      return;
    }

    // Signal that we are loading commit data
    setLoadingCommit(true);

    try {
      // Retrieve commits from GitHub API for this project
      const commitRequest = await axios.get<Commit[]>(
        `https://api.github.com/repos/${repo.full_name}/commits`
      );
      setCommit(commitRequest.data[0]);
    } catch {
      setCommit('Unable to load last commit data.');
    } finally {
      setLoadingCommit(false);
    }
  }

  async function loadReadme() {
    // Make sure we are not submitting concurrent requests
    if (!repo || loadingReadme) {
      return;
    }

    // Signal that we are loading the readme
    setLoadingReadme(true);

    try {
      // Retrieve the readme from the repo
      const readmeRequest = await axios.get<string>(
        `https://raw.githubusercontent.com/${repo.full_name}/master/README.md`
      );
      setReadme(readmeRequest.data);
    } catch {
      setReadme('Unable to load readme.');
    } finally {
      setLoadingReadme(false);
    }
  }

  if (!repo) {
    // If we haven't determined which repo we're reading from, do so

    // Make sure the index number provided is actually a valid number within the array range
    if (isNaN(indexNum)) {
      return (
        <>
          Invalid index provided (not a number). <Link to="/">Go back</Link>
        </>
      );
    } else if (indexNum < 0 || indexNum >= repos.length) {
      return (
        <>
          Invalid index provided (outside of list range).{' '}
          <Link to="/">Go back</Link>
        </>
      );
    }

    // Select the repo to use
    setRepo(repos[indexNum]);
  } else {
    // If we have determined which repo we're using, load its last commit and readme
    if (!loadingCommit && !commit) {
      loadCommit();
    }
    if (!loadingReadme && !readme) {
      loadReadme();
    }

    // Determine what we're displaying for commit data
    let commitOutput = <>Loading last commit...</>;
    if (typeof commit === 'string') {
      // If the commit is a string (probably an error), just output the string
      commitOutput = <>{commit}</>;
    } else if (commit) {
      // If the commit is a Commit object, output last commit details
      commitOutput = (
        <>
          Last commit by <b>{commit.commit.author.name}</b> on{' '}
          <b>{commit.commit.author.date}</b>:
          <br />
          {commit.commit.message}
        </>
      );
    }

    return (
      <>
        <p>
          <b>{repo.name}</b> – {repo.description ?? 'No description'} –{' '}
          {repo.language} – {repo.forks_count} fork(s)
        </p>
        <p>{commitOutput}</p>
        <p>
          <ReactMarkdown>{readme ?? 'Loading readme...'}</ReactMarkdown>
        </p>
        <p>
          <Link to="/">Go back</Link>
        </p>
      </>
    );
  }

  return null;
}

export { RepoDetails };
