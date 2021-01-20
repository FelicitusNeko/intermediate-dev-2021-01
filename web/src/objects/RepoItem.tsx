import { Link } from 'react-router-dom';
import { Repo } from '../typings/Repo';

interface RepoItemProps {
  repo: Repo;
  index: number;
}
function RepoItem({ repo, index }: RepoItemProps) {
  return (
    <li>
      <Link to={`/repo/${index}`}>{repo.name}</Link> –{' '}
      {repo.description ?? 'No description'} – {repo.language} –{' '}
      {repo.forks_count} fork(s)
    </li>
  );
}

export { RepoItem };
