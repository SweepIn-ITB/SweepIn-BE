import express from "express";
import type { Request, Response } from "express";
import { responseError } from "../class/Error";

import { filterReports } from './report.service';
import { Status } from ".prisma/client";

const route = express.Router();

/**
 * @method GET /reports
 * @param {string} user_id 
 * @param {string} start_date
 * @param {string} end_date
 * @param {string} status
 * @param {string} page - Current page
 * @param {string} per_page - The number of data in a page 
 * @returns reports
 * 
 * @example http://{{base_url}}/reports?user_id=:userId&status=:status&start_date=:startDate&end_date=:endDate&page=:page&per_page=:perPage
 */
route.get('/', async (req: Request, res: Response) => {
  try {
    const { user_id, start_date, end_date, status, page, per_page } = req.query;

    const reports = await filterReports(
      user_id as string,
      start_date as string,
      end_date as string,
      status as Status,
      page as string,
      per_page as string
    );

    return res.status(200).json({
      message: 'Get all reports successful',
      data: reports
    })
  } catch (error) {
    responseError(error, res);
  }
})

export default route;