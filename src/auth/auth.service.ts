import { UnauthorizedError } from "../class/Error"

import {
  getUsers,
  getUserByEmail,
  generateUser,
  countUsers
} from "./auth.repository"
import { InvalidAttributeError } from "../class/Error"

/**
 * Get all users
 *
 * @description Get all users from the database
 * @returns All users
 */

const findUsers = async (
  name: string | undefined,
  role: string | undefined,
  location: string | undefined,
  page: string,
  perPage: string
) => {
  const users = await getUsers(
    name,
    role,
    location,
    parseInt(page),
    parseInt(perPage)
  )

  if (!users) {
    throw new Error("Error fetching users")
  }

  return users
}

const countFilteredUsers = async (
  name: string | undefined,
  role: string | undefined,
  location: string | undefined
) => {
  return await countUsers(name, role, location)
}

/**
 * Verify user by email
 *
 * @description Verify if user has access to the app
 * @returns User's credentials
 */
const verifyUserByEmail = async (email: string) => {
  const user = await getUserByEmail(email)

  // Check if email is registered
  if (!user) {
    throw new UnauthorizedError("Email is not registered")
  }

  return user
}

/**
 * Create user
 *
 * @description create a new user using email, name, role, and location
 * @returns User's data
 */
const createUser = async (
  email: string,
  name: string,
  role: string,
  location: string
) => {
  // Verify the role and location match the enum
  if (role !== "ADMIN" && role !== "CLEANER" && role !== "SECURITY") {
    throw new InvalidAttributeError("Invalid role")
  }

  if (
    location !== "GANESHA" &&
    location !== "JATINANGOR" &&
    location !== "CIREBON" &&
    location !== "JAKARTA"
  ) {
    throw new InvalidAttributeError("Invalid location")
  }

  const user = await generateUser(email, name, role, location)

  if (!user) {
    throw new Error("Error creating user")
  }

  return user
}

export { findUsers, verifyUserByEmail, createUser, countFilteredUsers }
