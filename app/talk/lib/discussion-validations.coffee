MAX_LENGTH = 255 # characters

module.exports = [
  # existence
  {
    check: (comment) -> comment.length > 0
    error: "Discussion title cannot be empty"
  }
  # max-length
  {
    check: (comment) -> comment.length < MAX_LENGTH
    error: "Discussion title cannot be more than #{MAX_LENGTH} characters"
  }
  ]
