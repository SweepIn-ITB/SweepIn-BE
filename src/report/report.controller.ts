import express from "express"
import multer from "multer"
import type { Request, Response } from "express"
import { Status } from ".prisma/client"
import { responseError } from "../class/Error"

import { filterReports, submitReport, getReportDetails } from "./report.service"

const route = express.Router()
const upload = multer()

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
 * @example http://{{base_url}}/report?user_id=:userId&status=:status&start_date=:startDate&end_date=:endDate&page=:page&per_page=:perPage
 */
route.get("/", async (req: Request, res: Response) => {
  try {
    const { user_id, start_date, end_date, status, page, per_page } = req.query

    const reports = await filterReports(
      user_id as string,
      start_date as string,
      end_date as string,
      status as Status,
      page as string,
      per_page as string
    )

    return res.status(200).json({
      message: "Get all reports successful",
      data: reports
    })
  } catch (error) {
    responseError(error, res)
  }
})

/**
 * @method GET /report/:reportId
 * @param {string} report_id
 * @returns report
 *
 * @example http://{{base_url}}/report/
 */
route.get("/:reportId", async (req, res) => {
  try {
    const reportId = req.params.reportId

    const reportDetails = await getReportDetails(reportId as string)

    return res.status(200).json({
      message: "Get report details successful",
      data: reportDetails
    })
  } catch (error) {
    responseError(error, res)
  }
})

/**
 * @method POST /report
 * @param {string} user_id
 * @param {string} images
 * @param {string} description
 * @returns reportId
 *
 * @example http://{{base_url}}/report/
 */
route.post("/", upload.any(), async (req: Request, res: Response) => {
  try {
    const { user_id, description } = req.body
    const { files } = req

    const postReport = await submitReport(
      user_id as string,
      files as Express.Multer.File[],
      description as string
    )

    return res.status(200).json({
      message: "Submit post successful",
      data: {
        id: postReport
      }
    })
  } catch (error) {
    responseError(error, res)
  }
})

export default route
