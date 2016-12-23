
try {
  if (!process.env.SALT_WORK_FACTOR) {
    throw new Error("a SALT_WORK_FACTOR is required - please define one in the process env");
  }
  if (!process.env.APP_SECRET) {
    throw new Error("An APP_SECRET is required - please define one in process env");
  }
  if (!process.env.MONGO_CONNECTION_STRING) {
    throw new Error("A mongo db connection string is required - please define one in process env e.g. mongodb://127.0.0.1:27017/dbname");
  }
  if (!process.env.UPLOADED_FILES_DIR) {
    throw new Error("A UPLOADED_FILES_DIR is required - please define one in process env");
  }
  if (!process.env.HOST_URL) {
    throw new Error("A HOST_URL is required - please define one in process env");
  }
  if (!process.env.MAX_FILE_SIZE) {
    console.warn("A MAX_FILE_SIZE should be defined - please define one in process env");
  }
} catch (e) {
  console.error(e);
  process.exit(1);
}
