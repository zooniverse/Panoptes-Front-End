# Check should return a condition that the comment passses if good

MAX_LENGTH = 10000 # characters

module.exports = [
  # existence
  {
    check: (comment) -> comment.length > 0
    error: "Comments cannot be empty"
  }
  # max-length
  {
    check: (comment) -> comment.length < MAX_LENGTH
    error: "Comments cannot be more than #{MAX_LENGTH} characters"
  }
  ]
