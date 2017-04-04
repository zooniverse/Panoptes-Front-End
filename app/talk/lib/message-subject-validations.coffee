# Check should return a condition that the subject field passses if good

# Subject is subject field of a private message

MAX_LENGTH = 256 # characters
MINIMUM_LENGTH = 3 # characters

module.exports = [
  # existence
  {
    check: (subject) -> subject.length > 0
    error: "Subject field cannot be empty"
  }
  # max-length
  {
    check: (subject) -> subject.length < MAX_LENGTH
    error: "Subject field cannot be more than #{MAX_LENGTH} characters"
  }
  # minimum-length
  {
    check: (subject) -> subject.length >= MINIMUM_LENGTH
    error: "Subject field must be at least #{MINIMUM_LENGTH} characters"
  }
  ]
