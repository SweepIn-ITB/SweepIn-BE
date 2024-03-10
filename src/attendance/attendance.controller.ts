import express from "express";
import { responseError } from "../class/Error";

import { filterAttendances, getAttendanceDetails } from "./attendance.service";

const route = express.Router();

/**
 * @method GET /attendance
 * @param {string} user_id 
 * @param {string} start_date
 * @param {string} end_date
 * @param {string} page - Current page
 * @param {string} per_page - The number of data in a page 
 * @returns attendances
 * 
 * @example http://{{base_url}}/attendance?user_id=:userId&start_date=:startDate&end_date=:endDate&page=:page&per_page=:perPage
 */
route.get("/", async (req, res) => {
  try {
    const { user_id, start_date, end_date, page, per_page } = req.query;

    const attendances = await filterAttendances(
      user_id as string, 
      start_date as string,
      end_date as string,
      page as string, 
      per_page as string
    );

    res.status(200).json({
      message: "Get all attendance successful",
      data: {
        attendances,
      },
    });
  } catch (error) {
    responseError(error, res);
  }
});

/**
 * @method GET /attendance/:attendanceId
 * @param {string} attendanceId
 * @returns attendance
 * 
 * @example http://{{base_url}}/attendance/:attendanceId
 */
route.get('/:attendanceId', async (req, res) => {
  try {
    const attendanceId = req.params.attendanceId;

    const attendance = await getAttendanceDetails(attendanceId as string);

    return res.status(200).json({
      message: "Get one attendance successful",
      data: attendance
    })

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
})

export default route;
