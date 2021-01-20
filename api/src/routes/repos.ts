import axios, { AxiosError } from 'axios';
import { Router, Request, Response } from 'express';
import { report } from 'process';
import { Repo } from '../typings/Repo';

export const repos = Router();

repos.get('/', async (_: Request, res: Response) => {
  res.header('Cache-Control', 'no-store');

  // Retrieve info from repos JSON
  let repos: Repo[] = require('../../data/repos.json');

  try {
    // Get external repo data from GitHub
    let repoRequest = await axios.get<Repo[]>(
      'https://api.github.com/users/silverorange/repos'
    );

    // Append that list to the local list we have, then filter out any forks
    repos = repos.concat(repoRequest.data).filter((repo: Repo) => !repo.fork);

    // Output repo data
    res.status(200);
    res.json(repos);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      // If it is an Axios error, handle it as such
      let eAxios = e as AxiosError;

      // If the request returned an error, echo it; otherwise, output 500 server error
      res.status(eAxios.response ? eAxios.response.status : 500);

      // Either way, output the error message
      res.json({
        error: eAxios.message,
      });
    } else {
      // If it is not an Axios error, handle it as a generic error
      // Output 500 server error and the error message
      res.status(500);
      res.json({
        error: (e as Error).message,
      });
    }
  }
});
