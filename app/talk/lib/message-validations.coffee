# Check should return a condition that the message passses if good

MAX_LENGTH = 10000 # characters

module.exports = [
  # existence
  {
    check: (message) -> message.length > 0
    error: "Messages cannot be empty"
  }
  # max-length
  {
    check: (message) -> message.length < MAX_LENGTH
    error: "Messages cannot be more than #{MAX_LENGTH} characters"
  }
  ]
