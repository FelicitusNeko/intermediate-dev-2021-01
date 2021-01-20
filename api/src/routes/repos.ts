import { Router, Request, Response } from 'express';
import { Repo } from '../typings/Repo';

export const repos = Router();

repos.get('/', async (_: Request, res: Response) => {
  res.header('Cache-Control', 'no-store');

  // Retrieve info from repos JSON, filtering out any forks
  let repos: Repo[] = require('../../data/repos.json')
    .filter((repo: Repo) => !repo.fork);

  // Output repo data
  res.status(200);
  res.json(repos);
});
