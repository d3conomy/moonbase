import {
  logger,
  getLogBook,
  LogBook,
  LogBooksManager
} from './logBook.js';





const createRandomId = () => {
  return Math.random().toString(36).substring(2, 15);
}


export {
  // Misc. Tools
  createRandomId,
  // Log Book
  logger,
  getLogBook,
  LogBook,
  LogBooksManager
}